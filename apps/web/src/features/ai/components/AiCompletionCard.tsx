import React from 'react';
import type { AiCompletionResponse } from '@template/domain';

interface AiCompletionCardProps {
  completion: AiCompletionResponse | null;
  error?: string;
}

export function AiCompletionCard({ completion, error }: AiCompletionCardProps) {
  if (error) {
    return (
      <div style={{ padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b', fontSize: '0.875rem' }}>
        {error}
      </div>
    );
  }

  if (!completion) {
    return (
      <div style={{ padding: '16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#64748b', fontSize: '0.875rem', textAlign: 'center' }}>
        Enter a prompt above to trigger edge LLM inference via Cloudflare Workers AI.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#166534', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
          {completion.model}
        </span>
        <small style={{ color: '#15803d', fontSize: '0.75rem' }}>
          {new Date(completion.timestamp).toLocaleTimeString()}
        </small>
      </div>
      <p style={{ margin: 0, fontSize: '0.875rem', color: '#14532d', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
        {completion.response}
      </p>
    </div>
  );
}
