import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

interface FileUploadDropzoneProps {
  onUploadSuccess: () => void;
  api: any;
}

export function FileUploadDropzone({ onUploadSuccess, api }: FileUploadDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [customKey, setCustomKey] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage('');

    const key = customKey.trim() || file.name;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const res = await fetch(`/api/storage/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: arrayBuffer,
      });

      if (res.ok) {
        setMessage(`Successfully uploaded ${key}`);
        setFile(null);
        setCustomKey('');
        onUploadSuccess();
      } else {
        const json = await res.json();
        setMessage(`Upload failed: ${JSON.stringify(json)}`);
      }
    } catch (err) {
      setMessage('Network error during file upload');
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Input
        label="Select File"
        type="file"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            if (!customKey) {
              setCustomKey(e.target.files[0].name);
            }
          }
        }}
      />
      <Input
        label="Storage Key / Path"
        placeholder="e.g. documents/report.pdf"
        value={customKey}
        onChange={(e) => setCustomKey(e.target.value)}
      />
      <Button type="submit" disabled={!file || uploading}>
        {uploading ? 'Uploading to R2...' : 'Upload File'}
      </Button>
      {message && (
        <p style={{ margin: 0, fontSize: '0.875rem', color: message.includes('failed') ? '#dc2626' : '#16a34a' }}>
          {message}
        </p>
      )}
    </form>
  );
}
