import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, style, ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      {label && <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155' }}>{label}</label>}
      <input
        style={{
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid #cbd5e1',
          fontSize: '0.875rem',
          outline: 'none',
          boxSizing: 'border-box',
          width: '100%',
          ...style,
        }}
        {...props}
      />
    </div>
  );
}
