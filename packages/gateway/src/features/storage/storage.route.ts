import { Hono } from 'hono';
import { StorageService } from './storage.service';

export const storageRoute = new Hono<{ Bindings: EnvBindings }>()
  .get('/', async (c) => {
    const prefix = c.req.query('prefix');
    const limit = c.req.query('limit') ? parseInt(c.req.query('limit')!, 10) : undefined;
    const service = new StorageService(c.env.STORAGE_R2);
    const objects = await service.listObjects(prefix, limit);
    return c.json({ data: objects });
  })
  .get('/:key{.+}', async (c) => {
    const key = c.req.param('key');
    const service = new StorageService(c.env.STORAGE_R2);
    const object = await service.getObject(key);

    if (!object) {
      return c.json({ error: 'Object not found' }, 404);
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);

    return c.body(object.body, 200, Object.fromEntries(headers.entries()));
  })
  .put('/:key{.+}', async (c) => {
    const key = c.req.param('key');
    const contentType = c.req.header('content-type') || 'application/octet-stream';
    const body = await c.req.arrayBuffer();

    const service = new StorageService(c.env.STORAGE_R2);
    const metadata = await service.putObject(key, body, contentType);

    return c.json({ data: metadata }, 201);
  });
