import React, { useState } from 'react';
import { RegisterCredentialsSchema } from '@template/domain';
import { authClient } from '../lib/auth-client';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate using Zod domain schema
    const validationResult = RegisterCredentialsSchema.safeParse({ name, email, password });
    if (!validationResult.success) {
      setError(validationResult.error.errors[0]?.message || 'Invalid registration details');
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (authError) {
        setError(authError.message || 'Failed to register account');
      } else if (data) {
        onSuccess?.();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        <p className="text-xs text-slate-400 mt-1">
          Must be at least 8 chars, include uppercase, lowercase, number, and special character.
        </p>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>
      {onSwitchToLogin && (
        <p className="text-center text-sm text-slate-400 mt-2">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-400 hover:underline font-medium"
          >
            Sign In
          </button>
        </p>
      )}
    </form>
  );
};
