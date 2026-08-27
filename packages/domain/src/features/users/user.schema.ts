import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address format'),
  name: z.string().min(1, 'Name must contain at least 1 character').nullable().optional(),
});

export const UserSchema = z.object({
  id: z.string().uuid().or(z.string()),
  email: z.string().email(),
  name: z.string().nullable(),
  createdAt: z.string(),
});
