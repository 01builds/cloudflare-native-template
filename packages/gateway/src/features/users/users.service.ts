import { createDbClient, users } from '@template/db';
import { CreateUserInput, UserRecord } from '@template/domain';

const USERS_CACHE_KEY = 'users:all';

export class UsersService {
  constructor(private dbBinding: D1Database, private kvBinding?: KVNamespace) {}

  async getUsers(): Promise<UserRecord[]> {
    if (this.kvBinding) {
      try {
        const cached = await this.kvBinding.get<UserRecord[]>(USERS_CACHE_KEY, 'json');
        if (cached) {
          return cached;
        }
      } catch (err) {
        console.error('KV cache read error:', err);
      }
    }

    const db = createDbClient(this.dbBinding);
    const result = await db.query.users.findMany();

    if (this.kvBinding && result) {
      try {
        await this.kvBinding.put(USERS_CACHE_KEY, JSON.stringify(result), { expirationTtl: 60 });
      } catch (err) {
        console.error('KV cache write error:', err);
      }
    }

    return result;
  }

  async createUser(input: CreateUserInput): Promise<UserRecord> {
    const db = createDbClient(this.dbBinding);
    const userId = crypto.randomUUID();

    const newUser: UserRecord = {
      id: userId,
      email: input.email,
      name: input.name || null,
      createdAt: new Date().toISOString(),
    };

    await db.insert(users).values(newUser);

    if (this.kvBinding) {
      try {
        await this.kvBinding.delete(USERS_CACHE_KEY);
      } catch (err) {
        console.error('KV cache invalidate error:', err);
      }
    }

    return newUser;
  }
}
