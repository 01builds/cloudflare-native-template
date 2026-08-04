import { useEffect, useState } from 'react';
import { api } from './lib/api';
import type { User } from '@template/domain';

export default function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await api.api.users.$get();
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await api.api.users.$post({
        json: { email, name: name || undefined }
      });
      if (res.ok) {
        setEmail('');
        setName('');
        setMessage('User created successfully!');
        fetchUsers();
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
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '40px auto', padding: 20 }}>
      <h1>Cloudflare Native Starter</h1>
      
      <form onSubmit={createUser} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 30 }}>
        <h3>Create User</h3>
        <input 
          type="email" 
          placeholder="Email address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: 8 }}
        />
        <input 
          type="text" 
          placeholder="Name (optional)" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          style={{ padding: 8 }}
        />
        <button type="submit" disabled={loading} style={{ padding: 10, cursor: 'pointer' }}>
          {loading ? 'Submitting...' : 'Add User'}
        </button>
        {message && <p style={{ fontWeight: 'bold' }}>{message}</p>}
      </form>

      <h3>Users List</h3>
      {users.length === 0 ? (
        <p>No users found in database.</p>
      ) : (
        <ul style={{ paddingLeft: 20 }}>
          {users.map((user) => (
            <li key={user.id} style={{ margin: '8px 0' }}>
              <strong>{user.name || 'Anonymous'}</strong> ({user.email}) - <small>{new Date(user.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
