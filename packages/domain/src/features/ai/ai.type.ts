import { z } from 'zod';
import { AiTextPromptSchema } from './ai.schema';

export type AiTextPromptInput = z.infer<typeof AiTextPromptSchema>;

export interface AiCompletionResponse {
  response: string;
  model: string;
  timestamp: string;
}
