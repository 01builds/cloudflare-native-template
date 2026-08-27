import { AiCompletionResponse, AiTextPromptInput } from '@template/domain';

export class AiService {
  constructor(private ai: Ai) {}

  async generateText(input: AiTextPromptInput): Promise<AiCompletionResponse> {
    const model = '@cf/meta/llama-3.1-8b-instruct';
    if (!this.ai) {
      return {
        response: `[Mock AI Response] Text generated for prompt: "${input.prompt}"`,
        model,
        timestamp: new Date().toISOString(),
      };
    }

    try {
      const messages = [];
      if (input.system) {
        messages.push({ role: 'system', content: input.system });
      }
      messages.push({ role: 'user', content: input.prompt });

      const aiResponse = await this.ai.run(model as any, {
        messages,
        max_tokens: input.max_tokens || 256,
      });

      const responseText = typeof aiResponse === 'string'
        ? aiResponse
        : (aiResponse as any)?.response || JSON.stringify(aiResponse);

      return {
        response: responseText,
        model,
        timestamp: new Date().toISOString(),
      };
    } catch (err: any) {
      return {
        response: `[Simulated AI Response] Answer to "${input.prompt}"`,
        model,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
