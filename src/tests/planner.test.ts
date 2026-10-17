import type { IncomingMessage, ServerResponse } from 'node:http';
import { afterEach, expect, it, vi } from 'vitest';
import handler from '../../api/plan';
import { generatePlan } from '../../server/planner';
import { parsePlan, parsePlannerRequest, type AIPlan, type PlannerRequest } from '../data/aiPlan';

const input: PlannerRequest = { item: 'headphones', intent: 'fix', support: 'myself', budget: 'free', description: 'Only the left side plays. I have no tools and already tried another device.' };
const plan: AIPlan = { status: 'ready', summary: 'One side of your headphones is silent after a source check.', action: 'Check model support before paying for parts', reason: 'You have no tools and already tried another source.', steps: ['Find the model number and warranty information.', 'Ask support whether an assessment has a fee.'], alternative: 'Borrow a suitable pair if you need audio before support responds.', questions: [], resourceIds: ['headphones'] };
const completed = (value: unknown) => ({ status: 'completed', steps: [{ type: 'thought', content: [{ type: 'text', text: 'not output' }] }, { type: 'model_output', content: [{ type: 'text', text: JSON.stringify(value) }] }] });
const env = { GEMINI_API_KEY: 'test-api-key', GEMINI_MODEL: 'gemini-3.8-flash' };
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.useRealTimers(); });

it('calls Gemini with a server-side key, bounded output, structured schema and no stored interaction', async () => {
  const upstream = vi.fn().mockResolvedValue(Response.json(completed(plan)));
  const result = await generatePlan(input, env, upstream);
  expect(result).toEqual({ source: 'ai', model: env.GEMINI_MODEL, plan });
  const [url, options] = upstream.mock.calls[0];
  expect(url).toBe('https://generativelanguage.googleapis.com/v1beta/interactions');
  expect(options.headers['x-goog-api-key']).toBe('test-api-key');
  const body = JSON.parse(options.body);
  expect(body.store).toBe(false);
  expect(body.response_format.mime_type).toBe('application/json');
  expect(body.generation_config.max_output_tokens).toBe(4096);
  expect(body.input).toContain('already tried another device');
  expect(JSON.stringify(result)).not.toContain('test-api-key');
});
it('provides deterministic battery safety without a key or provider call', async () => {
  const upstream = vi.fn();
  const result = await generatePlan({ ...input, description: 'My headphones have a swollen battery and stopped working.' }, {}, upstream);
  expect(result.source).toBe('safety'); expect(result.plan.action).toContain('Stop'); expect(upstream).not.toHaveBeenCalled();
});
it('handles missing configuration, quota failures and provider details without leaking them', async () => {
  await expect(generatePlan(input, {})).rejects.toMatchObject({ status: 503 });
  await expect(generatePlan(input, env, vi.fn().mockResolvedValue(new Response('private upstream details', { status: 429 })))).rejects.toMatchObject({ status: 429 });
  await expect(generatePlan(input, env, vi.fn().mockRejectedValue(new Error('secret provider detail')))).rejects.toThrow('could not produce');
});
it('rejects invented resources, embedded links, malformed plans and incomplete generation', async () => {
  for (const invalid of [{ ...plan, resourceIds: ['invented-shop'] }, { ...plan, action: 'Go to https://fake.example' }, { ...plan, steps: [] }, { ...plan, status: ['ready'] }, { ...plan, status: 'unsupported' }]) {
    expect(parsePlan(invalid)).toBeNull();
  }
  await expect(generatePlan(input, env, vi.fn().mockResolvedValue(Response.json({ status: 'incomplete', steps: [] })))).rejects.toThrow('usable plan');
});
it('times out a stalled provider request', async () => {
  vi.useFakeTimers();
  const upstream = vi.fn((_url: unknown, options?: RequestInit) => new Promise<Response>((_resolve, reject) => {
    options?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
  }));
  const assertion = expect(generatePlan(input, env, upstream)).rejects.toThrow('took too long');
  await vi.advanceTimersByTimeAsync(20001); await assertion;
});
it('validates input scope, size and optional issue', () => {
  expect(parsePlannerRequest(input)).toEqual(input);
  for (const invalid of [{ ...input, item: 'laptop' }, { ...input, description: 'short' }, { ...input, description: 'a'.repeat(1501) }, { ...input, issue: 'button' }]) expect(parsePlannerRequest(invalid)).toBeNull();
});

const backupEnv = { ...env, AICREDITS_API_KEY: 'test-aicredits-key', AICREDITS_MODEL: 'openai/gpt-4o-mini' };
const chatResponse = (value: unknown = plan) => Response.json({ choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(value) } }] });
it('fails over to AICredits with separate credentials and validated JSON', async () => {
  const upstream = vi.fn().mockResolvedValueOnce(new Response('private error', { status: 503 })).mockResolvedValueOnce(chatResponse());
  const result = await generatePlan(input, backupEnv, upstream);
  expect(result).toMatchObject({ provider: 'aicredits', model: 'openai/gpt-4o-mini', plan });
  expect(upstream).toHaveBeenCalledTimes(2);
  const [url, options] = upstream.mock.calls[1];
  expect(url).toBe('https://api.aicredits.in/v1/chat/completions');
  expect(options.headers).toEqual({ 'Content-Type': 'application/json', Authorization: 'Bearer test-aicredits-key' });
  expect(JSON.stringify(options)).not.toContain('test-api-key');
  const body = JSON.parse(options.body);
  expect(body.response_format).toEqual({ type: 'json_object' });
  expect(body.no_cache).toBe(true); expect(body.messages[0].content).toContain('JSON schema');
});
it('uses AICredits directly when Gemini is unconfigured or AICredits mode is selected', async () => {
  for (const config of [{ AICREDITS_API_KEY: 'test-aicredits-key' }, { ...backupEnv, AI_PROVIDER: 'aicredits' }]) {
    const upstream = vi.fn().mockResolvedValue(chatResponse());
    expect((await generatePlan(input, config, upstream)).provider).toBe('aicredits');
    expect(upstream).toHaveBeenCalledTimes(1);
    expect(upstream.mock.calls[0][0]).toContain('api.aicredits.in');
  }
});
it('does not spend backup credits after a successful Gemini answer, including clarification', async () => {
  const upstream = vi.fn().mockResolvedValue(Response.json(completed({ ...plan, status: 'clarify', steps: [], questions: ['Which model is it?'] })));
  expect((await generatePlan(input, backupEnv, upstream)).plan.status).toBe('clarify');
  expect(upstream).toHaveBeenCalledTimes(1);
});
it('respects Gemini-only mode even when backup credentials exist', async () => {
  const upstream = vi.fn().mockResolvedValue(new Response('', { status: 429 }));
  await expect(generatePlan(input, { ...backupEnv, AI_PROVIDER: 'gemini' }, upstream)).rejects.toMatchObject({ status: 429 });
  expect(upstream).toHaveBeenCalledTimes(1);
});
it('rejects malformed fallback output and sanitises exhausted-credit errors', async () => {
  const config = { ...backupEnv, AI_PROVIDER: 'aicredits' };
  await expect(generatePlan(input, config, vi.fn().mockResolvedValue(chatResponse({ ...plan, resourceIds: ['fake'] })))).rejects.toThrow('usable plan');
  await expect(generatePlan(input, config, vi.fn().mockResolvedValue(new Response('wallet details and secrets', { status: 402 })))).rejects.toThrow('temporarily unavailable');
});
it('falls back after an 8-second primary timeout within the shared request budget', async () => {
  vi.useFakeTimers();
  const upstream = vi.fn().mockImplementationOnce((_url: unknown, options: RequestInit) => new Promise<Response>((_resolve, reject) => {
    options.signal?.addEventListener('abort', () => reject(new Error('aborted')));
  })).mockResolvedValueOnce(chatResponse());
  const pending = generatePlan(input, backupEnv, upstream);
  await vi.advanceTimersByTimeAsync(8001);
  expect((await pending).provider).toBe('aicredits'); expect(upstream).toHaveBeenCalledTimes(2);
});
it('fails over for invalid model output and quota errors without retrying the primary', async () => {
  for (const response of [Response.json(completed({ invalid: true })), new Response('', { status: 429 })]) {
    const upstream = vi.fn().mockResolvedValueOnce(response).mockResolvedValueOnce(chatResponse());
    expect((await generatePlan(input, backupEnv, upstream)).provider).toBe('aicredits');
    expect(upstream).toHaveBeenCalledTimes(2);
  }
});

let requestId = 0;
async function invoke(body: unknown = input, headers: Record<string, string> = {}, method = 'POST') {
  let output = '';
  const response = { statusCode: 200, setHeader: vi.fn(), end: (text: string) => { output = text; } };
  const req = { body, method, headers: { host: 'before-waste.test', 'content-type': 'application/json', 'x-vercel-forwarded-for': `test-${++requestId}`, ...headers }, socket: {} };
  await handler(req as unknown as IncomingMessage, response as unknown as ServerResponse);
  return { status: response.statusCode, body: JSON.parse(output), headers: response.setHeader };
}
it('enforces method, origin, media type, malformed and oversized body constraints', async () => {
  expect((await invoke(input, {}, 'GET')).status).toBe(405);
  expect((await invoke(input, { origin: 'https://other.test' })).status).toBe(403);
  expect((await invoke(input, { 'content-type': 'text/plain' })).status).toBe(415);
  expect((await invoke('not-json')).status).toBe(400);
  expect((await invoke({ ...input, description: 'a'.repeat(7000) })).status).toBe(413);
});
it('returns validated AI output through the actual API handler without exposing configuration', async () => {
  vi.stubEnv('GEMINI_API_KEY', 'test-api-key'); vi.stubEnv('GEMINI_MODEL', 'gemini-3.8-flash');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(completed(plan))));
  const result = await invoke();
  expect(result.status).toBe(200); expect(result.body.plan.action).toBe(plan.action);
  expect(result.headers).toHaveBeenCalledWith('Cache-Control', 'no-store');
  expect(JSON.stringify(result.body)).not.toContain('test-api-key');
});
it('throttles repeated requests to the API handler', async () => {
  vi.stubEnv('GEMINI_API_KEY', '');
  const statuses = [];
  for (let i = 0; i < 6; i++) statuses.push((await invoke(input, { 'x-vercel-forwarded-for': 'same-test-client' })).status);
  expect(statuses.slice(0, 5)).toEqual([503, 503, 503, 503, 503]); expect(statuses[5]).toBe(429);
});

it('accepts short description-only questions without forcing an item category', () => {
  const question = parsePlannerRequest({ description: 'Can I compost rice?' });
  expect(question).toMatchObject({ item: 'anything', intent: 'explore', description: 'Can I compost rice?' });
  expect(parsePlannerRequest({ ...input, item: 'anything' })).toBeNull();
});
it('sends open questions without invented budget or repair constraints and allows uncatalogued topics', async () => {
  const question = parsePlannerRequest({ description: 'How does a circular economy reduce resource use?' })!;
  const upstream = vi.fn().mockResolvedValue(Response.json(completed({ ...plan, resourceIds: [] })));
  await generatePlan(question, env, upstream);
  const body = JSON.parse(upstream.mock.calls[0][1].body);
  expect(JSON.parse(body.input).userSituation).toEqual({ description: question.description });
  expect(body.system_instruction).toContain('There is no fixed list');
  expect(body.system_instruction).toContain('Answer conceptual questions directly');
  expect(parsePlan({ ...plan, resourceIds: [] })).not.toBeNull();
});
it('protects open battery questions without mistaking ordinary food waste for a device fault', async () => {
  const upstream = vi.fn().mockResolvedValue(Response.json(completed({ ...plan, resourceIds: ['food'] })));
  const battery = parsePlannerRequest({ description: 'My laptop battery is swollen. Can I repair it?' })!;
  expect((await generatePlan(battery, {}, upstream)).source).toBe('safety');
  expect(upstream).not.toHaveBeenCalled();
  const food = parsePlannerRequest({ description: 'My potatoes are bulging out of the bag. How can I waste less?' })!;
  expect((await generatePlan(food, env, upstream)).source).toBe('ai');
});
