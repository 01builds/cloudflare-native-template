import { describe, it, expect } from 'vitest';
import app from '../src/index';

const dbRows: any[] = [];

const testEnv = {
  DB: {
    prepare: (sql: string) => {
      let boundParams: any[] = [];
      const stmt = {
        bind: (...params: any[]) => {
          boundParams = params;
          return stmt;
        },
        run: async () => {
          if (sql.toLowerCase().includes('insert into')) {
            // Primitive parsing for test insert
            const matches = sql.match(/values\s*\(([^)]+)\)/i);
            dbRows.push({
              id: boundParams[0],
              email: boundParams[1],
              name: boundParams[2],
              created_at: boundParams[3],
              createdAt: boundParams[3],
            });
          }
          return { success: true };
        },
        all: async () => {
          return {
            results: dbRows.map(r => ({
              id: r.id,
              email: r.email,
              name: r.name,
              created_at: r.created_at || r.createdAt,
              createdAt: r.created_at || r.createdAt,
            }))
          };
        },
        raw: async () => {
          return dbRows.map(r => [r.id, r.email, r.name, r.created_at || r.createdAt]);
        },
      };
      return stmt;
    },
    batch: async (statements: any[]) => [],
  },
  CACHE_KV: {
    data: new Map<string, string>(),
    async get(key: string, type?: string) {
      const val = this.data.get(key);
      if (!val) return null;
      return type === 'json' ? JSON.parse(val) : val;
    },
    async put(key: string, value: string) {
      this.data.set(key, value);
    },
    async delete(key: string) {
      this.data.delete(key);
    },
  },
  STORAGE_R2: {
    store: new Map<string, { body: ArrayBuffer; contentType?: string; uploaded: Date }>(),
    async list({ prefix, limit }: { prefix?: string; limit?: number }) {
      const objects = Array.from(this.store.entries())
        .filter(([k]) => !prefix || k.startsWith(prefix))
        .map(([k, v]) => ({
          key: k,
          size: v.body.byteLength,
          uploaded: v.uploaded,
          httpEtag: 'mock-etag',
          httpMetadata: { contentType: v.contentType },
        }));
      return { objects };
    },
    async get(key: string) {
      const item = this.store.get(key);
      if (!item) return null;
      return {
        body: item.body,
        httpEtag: 'mock-etag',
        uploaded: item.uploaded,
        size: item.body.byteLength,
        writeHttpMetadata: (headers: Headers) => {
          if (item.contentType) headers.set('content-type', item.contentType);
        },
      };
    },
    async put(key: string, body: ArrayBuffer, options?: any) {
      const item = {
        body,
        contentType: options?.httpMetadata?.contentType,
        uploaded: new Date(),
      };
      this.store.set(key, item);
      return {
        key,
        size: body.byteLength,
        uploaded: item.uploaded,
        httpEtag: 'mock-etag',
        httpMetadata: { contentType: item.contentType },
      };
    },
  },
  AI: {
    async run(model: string, inputs: any) {
      return { response: `Generated AI response for: ${inputs.messages?.[0]?.content || 'test'}` };
    },
  },
  ENVIRONMENT: 'test',
} as unknown as EnvBindings;

describe('Gateway HTTP Routes & Features', () => {
  it('GET /health returns 200 OK status', async () => {
    const response = await app.request('/health', {}, testEnv);
    expect(response.status).toBe(200);
    const json = await response.json<{ status: string; environment: string }>();
    expect(json.status).toBe('ok');
    expect(json.environment).toBe('test');
  });

  it('GET /api/users returns empty array initially and caches in KV', async () => {
    const response = await app.request('/api/users', {}, testEnv);
    expect(response.status).toBe(200);
    const json = await response.json<{ data: unknown[] }>();
    expect(json.data).toEqual([]);
  });

  it('POST /api/users creates user and invalidates cache', async () => {
    const response = await app.request(
      '/api/users',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', name: 'John Doe' }),
      },
      testEnv
    );
    expect(response.status).toBe(201);
    const json = await response.json<{ data: { email: string; name: string } }>();
    expect(json.data.email).toBe('test@example.com');
    expect(json.data.name).toBe('John Doe');

    // Fetch again
    const fetchRes = await app.request('/api/users', {}, testEnv);
    const fetchJson = await fetchRes.json<{ data: any[] }>();
    expect(fetchJson.data.length).toBe(1);
  });

  it('Storage operations: PUT, LIST, GET /api/storage', async () => {
    // Upload file
    const uploadRes = await app.request(
      '/api/storage/hello.txt',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'text/plain' },
        body: 'Hello World',
      },
      testEnv
    );
    expect(uploadRes.status).toBe(201);
    const uploadJson = await uploadRes.json<{ data: { key: string } }>();
    expect(uploadJson.data.key).toBe('hello.txt');

    // List files
    const listRes = await app.request('/api/storage', {}, testEnv);
    expect(listRes.status).toBe(200);
    const listJson = await listRes.json<{ data: any[] }>();
    expect(listJson.data.length).toBe(1);
    expect(listJson.data[0].key).toBe('hello.txt');

    // Download file
    const getRes = await app.request('/api/storage/hello.txt', {}, testEnv);
    expect(getRes.status).toBe(200);
    const text = await getRes.text();
    expect(text).toBe('Hello World');
  });

  it('POST /api/ai/generate triggers AI completion', async () => {
    const response = await app.request(
      '/api/ai/generate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Explain quantum computing simply' }),
      },
      testEnv
    );
    expect(response.status).toBe(200);
    const json = await response.json<{ data: { response: string; model: string } }>();
    expect(json.data.response).toBeDefined();
    expect(json.data.model).toBe('@cf/meta/llama-3.1-8b-instruct');
  });
});
