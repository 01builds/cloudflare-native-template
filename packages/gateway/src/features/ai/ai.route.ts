import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { AiTextPromptSchema } from '@template/domain';
import { AiService } from './ai.service';

export const aiRoute = new Hono<{ Bindings: EnvBindings }>()
  .post('/generate', zValidator('json', AiTextPromptSchema), async (c) => {
    const body = c.req.valid('json');
    const service = new AiService(c.env.AI);
    const result = await service.generateText(body);
    return c.json({ data: result });
  });
