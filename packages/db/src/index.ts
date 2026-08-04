import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema/index';

export * from './schema/index';

export function createDbClient(d1: D1Database) {
  return drizzle(d1, { schema });
}
