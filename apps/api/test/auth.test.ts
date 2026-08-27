import { describe, it, expect } from 'vitest';
import Database from 'better-sqlite3';

import * as authSchema from '@template/db';
import app from '../src/index';

// Create an in-memory SQLite database and set up tables
const sqlite = new Database(':memory:');

sqlite.exec(`
  CREATE TABLE \`user\` (
    \`id\` text PRIMARY KEY NOT NULL,
    \`name\` text NOT NULL,
    \`email\` text NOT NULL UNIQUE,
    \`email_verified\` integer DEFAULT 0 NOT NULL,
    \`image\` text,
    \`created_at\` integer NOT NULL,
    \`updated_at\` integer NOT NULL,
    \`two_factor_enabled\` integer DEFAULT 0
  );
  CREATE TABLE \`session\` (
    \`id\` text PRIMARY KEY NOT NULL,
    \`expires_at\` integer NOT NULL,
    \`token\` text NOT NULL UNIQUE,
    \`created_at\` integer NOT NULL,
    \`updated_at\` integer NOT NULL,
    \`ip_address\` text,
    \`user_agent\` text,
    \`user_id\` text NOT NULL,
    FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE
  );
  CREATE TABLE \`account\` (
    \`id\` text PRIMARY KEY NOT NULL,
    \`account_id\` text NOT NULL,
    \`provider_id\` text NOT NULL,
    \`user_id\` text NOT NULL,
    \`access_token\` text,
    \`refresh_token\` text,
    \`id_token\` text,
    \`access_token_expires_at\` integer,
    \`refresh_token_expires_at\` integer,
    \`scope\` text,
    \`password\` text,
    \`created_at\` integer NOT NULL,
    \`updated_at\` integer NOT NULL,
    \`issuer\` text,
    FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE
  );
  CREATE TABLE \`verification\` (
    \`id\` text PRIMARY KEY NOT NULL,
    \`identifier\` text NOT NULL,
    \`value\` text NOT NULL,
    \`expires_at\` integer NOT NULL,
    \`created_at\` integer,
    \`updated_at\` integer
  );
  CREATE TABLE \`two_factor\` (
    \`id\` text PRIMARY KEY NOT NULL,
    \`secret\` text NOT NULL,
    \`backup_codes\` text NOT NULL,
    \`user_id\` text NOT NULL,
    FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE
  );
`);

// Mock D1 Database interface delegating to better-sqlite3
const mockD1 = {
  prepare: (sql: string) => {
    let boundParams: any[] = [];
    const stmtObj = {
      bind: (...params: any[]) => {
        boundParams = params;
        return stmtObj;
      },
      run: async () => {
        const stmt = sqlite.prepare(sql);
        const info = stmt.run(...boundParams);
        return { success: true, meta: info };
      },
      all: async () => {
        const stmt = sqlite.prepare(sql);
        const rows = stmt.all(...boundParams);
        return { results: rows };
      },
      raw: async () => {
        const stmt = sqlite.prepare(sql);
        return stmt.raw().all(...boundParams);
      },
      first: async (colName?: string) => {
        const stmt = sqlite.prepare(sql);
        const row: any = stmt.get(...boundParams);
        if (!row) return null;
        return colName ? row[colName] : row;
      },
    };
    return stmtObj;
  },
  batch: async (statements: any[]) => {
    const results = [];
    for (const stmt of statements) {
      results.push(await stmt.run());
    }
    return results;
  },
  exec: async (sql: string) => {
    sqlite.exec(sql);
    return { count: 0, duration: 0 };
  },
} as unknown as D1Database;

const testEnv = {
  DB: mockD1,
  CACHE_KV: {} as any,
  STORAGE_R2: {} as any,
  AI: {} as any,
  ENVIRONMENT: 'test',
  AUTH_SECRET: 'test_auth_secret_minimum_32_characters_long_string',
  APP_URL: 'http://localhost:3000',
} as EnvBindings;

describe('Better Auth API Integration', () => {
  let sessionCookie = '';

  it('1. Sign up a new user via /api/auth/sign-up/email', async () => {
    const response = await app.request(
      '/api/auth/sign-up/email',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Jane Auth',
          email: 'jane@example.com',
          password: 'Password123!',
        }),
      },
      testEnv
    );

    expect(response.status).toBe(200);
    const json = await response.json<any>();
    expect(json.user).toBeDefined();
    expect(json.user.email).toBe('jane@example.com');
    expect(json.user.name).toBe('Jane Auth');

    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      sessionCookie = setCookie.split(';')[0];
    }
  });

  it('2. Reject weak password during sign-up', async () => {
    const response = await app.request(
      '/api/auth/sign-up/email',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Weak User',
          email: 'weak@example.com',
          password: '123',
        }),
      },
      testEnv
    );

    expect(response.status).toBe(400);
  });

  it('3. Sign in existing user via /api/auth/sign-in/email', async () => {
    const response = await app.request(
      '/api/auth/sign-in/email',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'jane@example.com',
          password: 'Password123!',
        }),
      },
      testEnv
    );

    expect(response.status).toBe(200);
    const json = await response.json<any>();
    expect(json.user).toBeDefined();

    const setCookie = response.headers.get('set-cookie');
    expect(setCookie).toBeTruthy();
    if (setCookie) {
      sessionCookie = setCookie.split(';')[0];
    }
  });

  it('4. Access protected endpoint /api/auth/me with session cookie', async () => {
    const response = await app.request(
      '/api/auth/me',
      {
        headers: { Cookie: sessionCookie },
      },
      testEnv
    );

    expect(response.status).toBe(200);
    const json = await response.json<any>();
    expect(json.user).toBeDefined();
    expect(json.user.email).toBe('jane@example.com');
    expect(json.session).toBeDefined();
  });

  it('5. Access protected endpoint /api/auth/me without cookie returns 401', async () => {
    const response = await app.request('/api/auth/me', {}, testEnv);
    expect(response.status).toBe(401);
  });

  it('6. Sign out revokes session', async () => {
    const signOutRes = await app.request(
      '/api/auth/sign-out',
      {
        method: 'POST',
        headers: { Cookie: sessionCookie },
      },
      testEnv
    );

    expect(signOutRes.status).toBe(200);

    const meRes = await app.request(
      '/api/auth/me',
      {
        headers: { Cookie: sessionCookie },
      },
      testEnv
    );
    expect(meRes.status).toBe(401);
  });
});
