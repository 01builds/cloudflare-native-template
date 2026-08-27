import React, { useState } from 'react';
import { authClient } from './lib/auth-client';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { UserProfileCard } from './components/UserProfileCard';
import { Card } from '../../components/ui/card';

export const AuthFeatureView: React.FC = () => {
  const { data: sessionData, isPending, refetch } = authClient.useSession();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const title = sessionData?.user
    ? 'User Profile'
    : isRegisterMode
    ? 'Create Account'
    : 'Authentication';

  const subtitle = sessionData?.user
    ? 'Active session details'
    : isRegisterMode
    ? 'Sign up with email and password'
    : 'Sign in to access protected features';

  return (
    <Card title={title} subtitle={subtitle}>
      {isPending ? (
        <div style={{ padding: '32px 0', textAlign: 'center', color: '#64748b' }}>Loading auth state...</div>
      ) : sessionData?.user ? (
        <UserProfileCard
          user={sessionData.user}
          session={sessionData.session}
          onSignOut={() => refetch()}
        />
      ) : isRegisterMode ? (
        <RegisterForm
          onSuccess={() => refetch()}
          onSwitchToLogin={() => setIsRegisterMode(false)}
        />
      ) : (
        <LoginForm
          onSuccess={() => refetch()}
          onSwitchToRegister={() => setIsRegisterMode(true)}
        />
      )}
    </Card>
  );
};
