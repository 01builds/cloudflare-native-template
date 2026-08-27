import React, { useState } from 'react';
import { Card } from '../../components/ui/card';
import { AiPromptInput } from './components/AiPromptInput';
import { AiCompletionCard } from './components/AiCompletionCard';
import { api } from '../../lib/api';
import type { AiCompletionResponse } from '@template/domain';

export function AiFeatureView() {
  const [completion, setCompletion] = useState<AiCompletionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate(prompt: string, system?: string) {
    setLoading(true);
    setError('');
    try {
      const res = await api.api.ai.generate.$post({
        json: { prompt, system },
      });

      if (res.ok) {
        const json = await res.json();
        setCompletion(json.data);
      } else {
        const errJson = await res.json();
        setError(`AI error: ${JSON.stringify(errJson)}`);
      }
    } catch (err: any) {
      setError('Network error executing AI completion query');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Workers AI Inference" subtitle="Execute text generation models (@cf/meta/llama-3.1-8b-instruct)">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <AiPromptInput onGenerate={handleGenerate} loading={loading} />
        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />
        <AiCompletionCard completion={completion} error={error} />
      </div>
    </Card>
  );
}
