import React from 'react';
import { UsersFeatureView } from './features/users/UsersFeatureView';
import { StorageFeatureView } from './features/storage/StorageFeatureView';
import { AiFeatureView } from './features/ai/AiFeatureView';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '20px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.025em' }}>
              Cloudflare Native Starter
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>
              Symmetric Feature-Driven Architecture Dashboard
            </p>
          </div>
          <span style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '4px 12px', fontSize: '0.75rem', color: '#38bdf8' }}>
            Workerd Edge Engine
          </span>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '32px auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          <UsersFeatureView />
          <StorageFeatureView />
          <AiFeatureView />
        </div>
      </main>
    </div>
  );
}
