import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { CreateUserSchema } from '@template/domain';
import { UsersService } from './users.service';

export const usersRoute = new Hono<{ Bindings: EnvBindings }>()
  .get('/', async (c) => {
    const service = new UsersService(c.env.DB, c.env.CACHE_KV);
    const result = await service.getUsers();
    return c.json({ data: result });
  })
  .post('/', zValidator('json', CreateUserSchema), async (c) => {
    const body = c.req.valid('json');
    const service = new UsersService(c.env.DB, c.env.CACHE_KV);
    const newUser = await service.createUser(body);
    return c.json({ data: newUser }, 201);
  });
