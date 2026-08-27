import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({ variant = 'primary', style, children, ...props }: ButtonProps) {
  const bgColors = {
    primary: '#2563eb',
    secondary: '#64748b',
    danger: '#dc2626',
  };

  return (
    <button
      style={{
        backgroundColor: bgColors[variant],
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        padding: '8px 16px',
        fontWeight: 500,
        fontSize: '0.875rem',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.6 : 1,
        transition: 'background-color 0.2s',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
