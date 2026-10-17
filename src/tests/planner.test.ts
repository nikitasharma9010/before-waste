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
