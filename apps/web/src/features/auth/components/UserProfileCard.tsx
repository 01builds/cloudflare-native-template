import React from 'react';
import { authClient } from '../lib/auth-client';
import { Button } from '../../../components/ui/button';

interface UserProfileCardProps {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
  };
  session?: {
    id: string;
    expiresAt: Date | string;
  } | null;
  onSignOut?: () => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, session, onSignOut }) => {
  const handleSignOut = async () => {
    await authClient.signOut();
    onSignOut?.();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {user.image ? (
          <img src={user.image} alt={user.name} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
        ) : (
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.125rem',
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#0f172a' }}>{user.name}</h3>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>{user.email}</p>
        </div>
      </div>

      {session && (
        <div style={{
          padding: '12px',
          backgroundColor: '#f8fafc',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
          fontSize: '0.75rem',
          color: '#334155',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <p style={{ margin: 0 }}><span style={{ fontWeight: 600, color: '#64748b' }}>Session ID:</span> {session.id}</p>
          <p style={{ margin: 0 }}><span style={{ fontWeight: 600, color: '#64748b' }}>Expires:</span> {new Date(session.expiresAt).toLocaleString()}</p>
        </div>
      )}

      <Button variant="secondary" onClick={handleSignOut} style={{ width: '100%' }}>
        Sign Out
      </Button>
    </div>
  );
};
