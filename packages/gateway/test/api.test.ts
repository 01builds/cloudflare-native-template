import { env } from 'cloudflare:workers';
import { describe, it, expect, beforeAll } from 'vitest';
import app from '../src/index';

const testEnv = env as unknown as EnvBindings;

describe('Gateway HTTP Routes', () => {
  beforeAll(async () => {
    await testEnv.DB.batch([
      testEnv.DB.prepare(`CREATE TABLE IF NOT EXISTS users (
        id text PRIMARY KEY NOT NULL,
        email text NOT NULL UNIQUE,
        name text,
        created_at text NOT NULL
      )`)
    ]);
  });

  it('GET /health returns 200 OK status', async () => {
    const response = await app.request('/health', {}, testEnv);
    expect(response.status).toBe(200);
    const json = await response.json<{ status: string }>();
    expect(json.status).toBe('ok');
  });

  it('GET /api/users returns empty array initially', async () => {
    const response = await app.request('/api/users', {}, testEnv);
    expect(response.status).toBe(200);
    const json = await response.json<{ data: unknown[] }>();
    expect(json.data).toEqual([]);
  });

  it('POST /api/users validation and creation check', async () => {
    const response = await app.request(
      '/api/users',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', name: 'John Doe' })
      },
      testEnv
    );
    expect(response.status).toBe(201);
    const json = await response.json<{ data: { email: string; name: string } }>();
    expect(json.data.email).toBe('test@example.com');
    expect(json.data.name).toBe('John Doe');
  });
});
