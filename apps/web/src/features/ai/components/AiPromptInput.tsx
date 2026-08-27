import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

interface AiPromptInputProps {
  onGenerate: (prompt: string, system?: string) => Promise<void>;
  loading: boolean;
}

export function AiPromptInput({ onGenerate, loading }: AiPromptInputProps) {
  const [prompt, setPrompt] = useState('');
  const [system, setSystem] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    await onGenerate(prompt, system.trim() || undefined);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Input
        label="System Prompt (Optional)"
        placeholder="e.g. You are an expert TypeScript assistant."
        value={system}
        onChange={(e) => setSystem(e.target.value)}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>User Prompt</label>
        <textarea
          rows={3}
          placeholder="e.g. Write a quick summary of serverless Workers benefits."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            outline: 'none',
            resize: 'vertical',
          }}
        />
      </div>
      <Button type="submit" disabled={loading || !prompt.trim()}>
        {loading ? 'Generating AI Response...' : 'Send Prompt to AI'}
      </Button>
    </form>
  );
}
