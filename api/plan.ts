import type { IncomingMessage, ServerResponse } from 'node:http';
import { parsePlannerRequest } from '../src/data/aiPlan.js';
import { generatePlan, PlannerError } from '../server/planner.js';

export const config = { maxDuration: 30 };
type Request = IncomingMessage & { body?: unknown };
// Best-effort per-instance throttling. A Vercel Firewall rule is needed for distributed enforcement.
const buckets = new Map<string, { count: number; until: number }>();
function allowed(id: string, max: number) {
  const now = Date.now();
  for (const [key, value] of buckets) if (value.until <= now) buckets.delete(key);
  if (buckets.size > 1000) return false;
  const bucket = buckets.get(id) ?? { count: 0, until: now + 60000 };
  bucket.count++; buckets.set(id, bucket);
  return bucket.count <= max;
}
async function readBody(req: Request): Promise<unknown> {
  if (req.body !== undefined) {
    const text = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(text) > 40000) throw new PlannerError(413, 'Please shorten your description.');
    return JSON.parse(text);
  }
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const bytes = Buffer.from(chunk); size += bytes.length;
    if (size > 40000) throw new PlannerError(413, 'Please shorten your description.');
    chunks.push(bytes);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
export default async function handler(req: Request, res: ServerResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const send = (status: number, value: unknown) => { res.statusCode = status; res.end(JSON.stringify(value)); };
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); send(405, { error: 'Use POST to request a plan.' }); return; }
  if (!req.headers['content-type']?.startsWith('application/json')) { send(415, { error: 'Send a JSON description.' }); return; }
  try {
    const origin = req.headers.origin;
    if (origin && new URL(origin).host !== req.headers.host) { send(403, { error: 'Use the planner from this website.' }); return; }
    if (req.headers['sec-fetch-site'] === 'cross-site') { send(403, { error: 'Use the planner from this website.' }); return; }
    const ip = String(req.headers['x-vercel-forwarded-for'] ?? req.headers['x-forwarded-for'] ?? req.socket.remoteAddress ?? 'unknown').split(',')[0];
    if (!allowed('global', 30) || !allowed(`ip:${ip}`, 5)) {
      res.setHeader('Retry-After', '60'); send(429, { error: 'Too many requests. Please wait a minute and try again.' }); return;
    }
    const input = parsePlannerRequest(await readBody(req));
    if (!input) { send(400, { error: 'Ask a question or describe your situation in 10-1500 characters.' }); return; }
    send(200, await generatePlan(input));
  } catch (error) {
    if (error instanceof PlannerError) send(error.status, { error: error.message, code: error.code });
    else send(400, { error: 'The request could not be read. Please try again.' });
  }
}
