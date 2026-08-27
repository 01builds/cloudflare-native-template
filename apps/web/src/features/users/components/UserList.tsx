import React from 'react';
import type { UserRecord } from '@template/domain';

interface UserListProps {
  users: UserRecord[];
  loading: boolean;
}

export function UserList({ users, loading }: UserListProps) {
  if (loading) {
    return <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Loading users...</p>;
  }

  if (users.length === 0) {
    return <p style={{ fontSize: '0.875rem', color: '#64748b' }}>No users registered yet.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {users.map((user) => (
        <li
          key={user.id}
          style={{
            padding: '10px 12px',
            backgroundColor: '#f8fafc',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            fontSize: '0.875rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <strong style={{ color: '#0f172a' }}>{user.name || 'Anonymous'}</strong>
            <span style={{ color: '#64748b', marginLeft: '8px' }}>({user.email})</span>
          </div>
          <small style={{ color: '#94a3b8' }}>
            {new Date(user.createdAt).toLocaleDateString()}
          </small>
        </li>
      ))}
    </ul>
  );
}
