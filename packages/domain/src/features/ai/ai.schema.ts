import { z } from 'zod';

export const AiTextPromptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  system: z.string().optional(),
  max_tokens: z.number().int().positive().optional(),
});
