import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { CreateUserForm } from './components/CreateUserForm';
import { UserList } from './components/UserList';
import { api } from '../../lib/api';
import type { UserRecord } from '@template/domain';

export function UsersFeatureView() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await api.api.users.$get();
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Card title="User Management" subtitle="Manage D1 SQL records cached via KV">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <CreateUserForm onUserCreated={fetchUsers} api={api} />
        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />
        <div>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#334155' }}>Existing Users</h3>
          <UserList users={users} loading={loading} />
        </div>
      </div>
    </Card>
  );
}
