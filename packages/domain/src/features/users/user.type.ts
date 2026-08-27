import { z } from 'zod';
import { CreateUserSchema, UserSchema } from './user.schema';

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UserRecord = z.infer<typeof UserSchema>;
