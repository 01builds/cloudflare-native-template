import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { FileUploadDropzone } from './components/FileUploadDropzone';
import { StorageObjectList } from './components/StorageObjectList';
import { api } from '../../lib/api';
import type { StorageObjectMetadata } from '@template/domain';

export function StorageFeatureView() {
  const [objects, setObjects] = useState<StorageObjectMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchObjects() {
    setLoading(true);
    try {
      const res = await api.api.storage.$get();
      if (res.ok) {
        const json = await res.json();
        setObjects(json.data);
      }
    } catch (err) {
      console.error('Error fetching storage objects:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchObjects();
  }, []);

  return (
    <Card title="Object Storage (R2)" subtitle="Upload and retrieve bucket items directly on Cloudflare Edge">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <FileUploadDropzone onUploadSuccess={fetchObjects} api={api} />
        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />
        <div>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#334155' }}>Stored Objects</h3>
          <StorageObjectList objects={objects} loading={loading} />
        </div>
      </div>
    </Card>
  );
}
