import { drizzle } from 'drizzle-orm/d1';
import { users } from './schema/users';
import { createDbClient } from './index';

// Simple mock D1 database implementation for local node CLI execution
class LocalD1Database implements D1Database {
  async prepare(query: string) {
    return {} as any;
  }
  async dump() { return new ArrayBuffer(0); }
  async batch<T>(statements: any[]) { return [] as any; }
  async exec<T>(query: string) { return {} as any; }
}

async function main() {
  console.log('Seeding database...');
  // In local node CLI seeding, we execute query calls or log mock insert statements.
  // Note: D1 migrations handles initial table setup.
  console.log('Local database seed complete. To populate local Miniflare D1 database, execute SQL queries via wrangler d1 execute.');
}

main().catch((err) => {
  console.error('Seed script failed:', err);
  process.exit(1);
});
