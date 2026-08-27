import { z } from 'zod';

export const UploadObjectSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  contentType: z.string().optional(),
});

export const StorageObjectQuerySchema = z.object({
  prefix: z.string().optional(),
  limit: z.coerce.number().min(1).max(1000).optional().default(100),
});
