import React from 'react';
import type { StorageObjectMetadata } from '@template/domain';
import { Button } from '../../../components/ui/button';

interface StorageObjectListProps {
  objects: StorageObjectMetadata[];
  loading: boolean;
}

export function StorageObjectList({ objects, loading }: StorageObjectListProps) {
  if (loading) {
    return <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Loading storage objects...</p>;
  }

  if (objects.length === 0) {
    return <p style={{ fontSize: '0.875rem', color: '#64748b' }}>No files found in R2 storage bucket.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {objects.map((obj) => (
        <li
          key={obj.key}
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
            <strong style={{ color: '#0f172a' }}>{obj.key}</strong>
            <span style={{ color: '#64748b', marginLeft: '8px' }}>
              ({(obj.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <a
            href={`/api/storage/${encodeURIComponent(obj.key)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Button variant="secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              Download
            </Button>
          </a>
        </li>
      ))}
    </ul>
  );
}
