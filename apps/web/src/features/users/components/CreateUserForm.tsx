import React, { useState } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

interface CreateUserFormProps {
  onUserCreated: () => void;
  api: any;
}

export function CreateUserForm({ onUserCreated, api }: CreateUserFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await api.api.users.$post({
        json: { email, name: name || undefined },
      });

      if (res.ok) {
        setEmail('');
        setName('');
        setMessage('User created successfully!');
        onUserCreated();
      } else {
        const errJson = await res.json();
        setMessage(`Error: ${JSON.stringify(errJson)}`);
      }
    } catch (err) {
      setMessage('Network error creating user');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Input
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Full Name (Optional)"
        type="text"
        placeholder="John Doe"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </Button>
      {message && (
        <p style={{ margin: 0, fontSize: '0.875rem', color: message.startsWith('Error') ? '#dc2626' : '#16a34a' }}>
          {message}
        </p>
      )}
    </form>
  );
}
