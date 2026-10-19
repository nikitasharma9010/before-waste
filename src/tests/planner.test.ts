import type { IncomingMessage, ServerResponse } from 'node:http';
import { afterEach, expect, it, vi } from 'vitest';
import handler from '../../api/plan';
import { generatePlan } from '../../server/planner';
import { planText, PLAN_LABELS, parsePlan, parsePlannerRequest, type AIPlan, type PlannerRequest } from '../data/aiPlan';

const input: PlannerRequest = { item: 'headphones', intent: 'fix', support: 'myself', budget: 'free', description: 'Only the left side plays. I have no tools and already tried another device.' };
const plan: AIPlan = { status: 'ready', summary: 'One side of your headphones is silent after a source check.', action: 'Check model support before paying for parts', reason: 'You have no tools and already tried another source.', steps: ['Find the model number and warranty information.', 'Ask support whether an assessment has a fee.'], alternative: 'Borrow a suitable pair if you need audio before support responds.', questions: [], resourceIds: ['headphones'] };
const completed = (value: unknown) => ({ choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(value) } }] });
const env = { AICREDITS_API_KEY: 'test-api-key', AICREDITS_MODEL: 'openai/gpt-4o-mini' };
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.useRealTimers(); });

it('calls AICredits with a server-side key and bounded JSON output', async () => {
  const upstream = vi.fn().mockResolvedValue(Response.json(completed(plan)));
  const result = await generatePlan(input, env, upstream);
  expect(result).toEqual({ source: 'ai', model: env.AICREDITS_MODEL, provider: 'aicredits', plan });
  const [url, options] = upstream.mock.calls[0];
  expect(url).toBe('https://api.aicredits.in/v1/chat/completions');
  expect(options.headers.Authorization).toBe('Bearer test-api-key');
  const body = JSON.parse(options.body);
  expect(body.no_cache).toBe(true);
  expect(body.response_format.type).toBe('json_object');
  expect(body.max_tokens).toBe(4096);
  expect(body.messages[1].content).toContain('already tried another device');
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
it('ignores legacy Gemini settings and always routes to AICredits', async () => {
  for (const AI_PROVIDER of ['auto', 'gemini', 'aicredits']) {
    const upstream = vi.fn().mockResolvedValue(chatResponse());
    expect((await generatePlan(input, {...env, AI_PROVIDER, GEMINI_API_KEY:'unused'}, upstream)).provider).toBe('aicredits');
    expect(upstream).toHaveBeenCalledTimes(1);
    expect(upstream.mock.calls[0][0]).toBe('https://api.aicredits.in/v1/chat/completions');
    expect(JSON.stringify(upstream.mock.calls)).not.toContain('unused');
  }
});
it('requires AICredits credentials even if an old Gemini key exists', async () => {
  const upstream = vi.fn();
  await expect(generatePlan(input, {GEMINI_API_KEY:'unused'}, upstream)).rejects.toMatchObject({code:'AI_NOT_CONFIGURED'});
  expect(upstream).not.toHaveBeenCalled();
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
  expect((await invoke({ ...input, description: 'a'.repeat(41000) })).status).toBe(413);
});
it('returns validated AI output through the actual API handler without exposing configuration', async () => {
  vi.stubEnv('AICREDITS_API_KEY', 'test-api-key'); vi.stubEnv('AICREDITS_MODEL', 'openai/gpt-4o-mini');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json(completed(plan))));
  const result = await invoke();
  expect(result.status).toBe(200); expect(result.body.plan.action).toBe(plan.action);
  expect(result.headers).toHaveBeenCalledWith('Cache-Control', 'no-store');
  expect(JSON.stringify(result.body)).not.toContain('test-api-key');
});
it('throttles repeated requests to the API handler', async () => {
  vi.stubEnv('AICREDITS_API_KEY', '');
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
  expect(JSON.parse(body.messages[1].content).userSituation).toEqual({ description: question.description });
  expect(body.messages[0].content).toContain('There is no fixed list');
  expect(body.messages[0].content).toContain('Answer conceptual questions directly');
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


it('validates optional location without breaking location-free requests', () => {
  expect(parsePlannerRequest({ description: 'Where can I recycle a broken kettle?', location: '  Pune, India  ' })?.location).toBe('Pune, India');
  expect(parsePlannerRequest({ description: 'Where can I recycle a broken kettle?', location: '' })?.location).toBeUndefined();
  for (const location of [123, {}, 'x'.repeat(121)]) expect(parsePlannerRequest({ ...input, location })).toBeNull();
});
it('passes provided location and constraints to both services with locality and formatting rules', async () => {
  const question = parsePlannerRequest({ description: 'I live in a small flat in Pune. How can I reduce food waste without spending more than INR 200?', location: 'Pune, India' })!;
  for (const provider of ['aicredits']) {
    const upstream = vi.fn().mockResolvedValue(chatResponse());
    await generatePlan(question, { ...backupEnv, AI_PROVIDER: provider }, upstream);
    const body = JSON.parse(upstream.mock.calls[0][1].body);
    const context = JSON.parse(body.messages[1].content);
    const instructions = body.messages[0].content;
    expect(context.userSituation.location).toBe('Pune, India');
    expect(context.userSituation.description).toContain('INR 200');
    expect(context.userSituation.budget).toBeUndefined();
    expect(instructions).toContain('US-labelled resources are background only outside the US');
    expect(instructions).toContain('If locations conflict or are ambiguous');
    expect(instructions).toContain('without Markdown headings');
    expect(instructions).toContain('Do not mention model names');
  }
});
it('uses the same section labels for generated display and copy/save text', () => {
  const text = planText(plan);
  for (const label of [PLAN_LABELS.reason, PLAN_LABELS.steps, PLAN_LABELS.alternative, PLAN_LABELS.resources]) expect(text).toContain(label);
  expect(text).not.toContain('undefined');
});


it('normalizes provider formatting into the same plain-text answer structure', async () => {
  const decorated = { ...plan, action: '### **Check model support before paying for parts**',
    summary: '  One side of your headphones is silent after a source check.  ',
    reason: '**You have no tools and already tried another source.**',
    steps: ['1. Find the model number and warranty information.', '- Ask support whether an assessment has a fee.'] };
  for (const provider of ['aicredits']) {
    const upstream = vi.fn().mockResolvedValue(chatResponse(decorated));
    const result = await generatePlan(input, { ...backupEnv, AI_PROVIDER: provider }, upstream);
    expect(result.plan).toEqual(plan);
    expect(planText(result.plan)).toBe(planText(plan));
  }
});
it('rejects unsupported tables, HTML and fenced answers instead of displaying broken layouts', () => {
  for (const summary of ['<h1>Advice</h1>', '```text Advice ```', '| Option | Result |']) {
    expect(parsePlan({ ...plan, summary })).toBeNull();
  }
  expect(parsePlan({ ...plan, steps: ['- '] })).toBeNull();
});
it('bounds conversation context and strips extra fields before forwarding', () => {
  const context = [{ question: 'I live in Pune and have no garden.', answer: 'Start with prevention.', note: 'private' }];
  expect(parsePlannerRequest({ ...input, context })?.context).toEqual([{ question: context[0].question, answer: context[0].answer }]);
  for (const context of [Array(3).fill({ question: 'q', answer: 'a' }), [{ question: 'q'.repeat(1701), answer: 'a' }], [{ question: 'q', answer: 7 }]]) {
    expect(parsePlannerRequest({ ...input, context })).toBeNull();
  }
});
it('forwards bounded previous turns and rejects extra steps for an explicit one-action request', async () => {
  const requestInput = { ...input, description: 'Give me exactly ONE no-cost action for my headphones.', context: [{ question: 'I have no tools.', answer: 'Check support.' }] };
  const upstream = vi.fn().mockResolvedValue(Response.json(completed(plan)));
  await expect(generatePlan(requestInput, env, upstream)).rejects.toThrow('usable plan');
  const body = JSON.parse(upstream.mock.calls[0][1].body);
  expect(body.messages[0].content).toContain('"maxItems":1');
  expect(JSON.parse(body.messages[1].content).previousTurns).toEqual(requestInput.context);
  const one = { ...plan, alternative: '', steps: [plan.steps[0]] };
  expect((await generatePlan(requestInput, env, vi.fn().mockResolvedValue(Response.json(completed(one))))).plan.steps).toHaveLength(1);
});
it('retains essential deterministic safety guidance even when one action is requested', async () => {
  const result = await generatePlan({ ...input, description: 'Give me one action for my phone with a swollen battery.' }, {});
  expect(result.source).toBe('safety');
  expect(result.plan.steps).toHaveLength(2);
});
it('accepts a whole-response JSON fence without weakening content validation', async () => {
  const wrapped = (value: unknown) => Response.json({choices:[{finish_reason:'stop',message:{content:'```json\n'+JSON.stringify(value)+'\n```'}}]});
  expect((await generatePlan(input,env,vi.fn().mockResolvedValue(wrapped(plan)))).plan).toEqual(plan);
  await expect(generatePlan(input,env,vi.fn().mockResolvedValue(wrapped({...plan,steps:['Open the battery casing.']})))).rejects.toMatchObject({code:'AI_OUTPUT_POLICY'});
});
it('distinguishes upstream access, credits, rate limits and malformed answers without logging private data', async () => {
  const log=vi.spyOn(console,'warn').mockImplementation(()=>{});
  for (const [status,code] of [[401,'AI_ACCESS'],[402,'AI_CREDITS'],[404,'AI_MODEL_OR_ENDPOINT'],[429,'AI_RATE_LIMIT'],[500,'AI_UPSTREAM']] as const) {
    await expect(generatePlan({...input,description:'Private user question about a secret item.'},env,vi.fn().mockResolvedValue(new Response('secret upstream error',{status})))).rejects.toMatchObject({code});
  }
  await expect(generatePlan(input,env,vi.fn().mockResolvedValue(Response.json({status:'completed',steps:[]})))).rejects.toMatchObject({code:'AI_INVALID_RESPONSE'});
  await expect(generatePlan(input,env,vi.fn().mockRejectedValue(new TypeError('secret network error')))).rejects.toMatchObject({code:'AI_NETWORK'});
  const recorded=JSON.stringify(log.mock.calls);
  expect(recorded).not.toContain('Private user'); expect(recorded).not.toContain('test-api-key'); expect(recorded).not.toContain('secret');
});


it('retries a single-provider 503 once after backoff and can recover', async () => {
  vi.useFakeTimers();
  const upstream = vi.fn().mockResolvedValueOnce(new Response('', {status:503})).mockResolvedValueOnce(Response.json(completed(plan)));
  const pending = generatePlan(input,env,upstream);
  await vi.advanceTimersByTimeAsync(499);
  expect(upstream).toHaveBeenCalledTimes(1);
  await vi.advanceTimersByTimeAsync(1);
  expect((await pending).plan).toEqual(plan);
  expect(upstream).toHaveBeenCalledTimes(2);
});
it('bounds persistent single-provider 503 failures to two attempts', async () => {
  vi.useFakeTimers();
  const upstream = vi.fn().mockResolvedValue(new Response('', {status:503}));
  const pending = expect(generatePlan(input,env,upstream)).rejects.toMatchObject({code:'AI_UPSTREAM'});
  await vi.advanceTimersByTimeAsync(500); await pending;
  expect(upstream).toHaveBeenCalledTimes(2);
});
it('does not retry a 503 when the shared budget has nearly expired', async () => {
  vi.useFakeTimers();
  const upstream = vi.fn().mockImplementation(async () => {
    vi.setSystemTime(Date.now()+19000); return new Response('', {status:503});
  });
  await expect(generatePlan(input,env,upstream)).rejects.toMatchObject({code:'AI_UPSTREAM'});
  expect(upstream).toHaveBeenCalledTimes(1);
});
it.each([400,401,402,404,429,500])('does not repeat non-retryable upstream status %s', async status => {
  const upstream = vi.fn().mockResolvedValue(new Response('', {status}));
  await expect(generatePlan(input,env,upstream)).rejects.toBeDefined();
  expect(upstream).toHaveBeenCalledTimes(1);
});
