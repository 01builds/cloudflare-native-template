import { StorageObjectMetadata } from '@template/domain';

export class StorageService {
  constructor(private r2: R2Bucket) {}

  async listObjects(prefix?: string, limit = 100): Promise<StorageObjectMetadata[]> {
    if (!this.r2) {
      return [];
    }
    const listResult = await this.r2.list({ prefix, limit });
    return listResult.objects.map((obj) => ({
      key: obj.key,
      size: obj.size,
      uploaded: obj.uploaded.toISOString(),
      etag: obj.httpEtag,
      contentType: obj.httpMetadata?.contentType,
    }));
  }

  async getObject(key: string): Promise<R2ObjectBody | null> {
    if (!this.r2) {
      return null;
    }
    return await this.r2.get(key);
  }

  async putObject(key: string, body: ReadableStream | ArrayBuffer | string, contentType?: string): Promise<StorageObjectMetadata> {
    if (!this.r2) {
      throw new Error('R2 storage binding not available');
    }
    const obj = await this.r2.put(key, body, {
      httpMetadata: contentType ? { contentType } : undefined,
    });
    if (!obj) {
      throw new Error('Failed to upload object');
    }
    return {
      key: obj.key,
      size: obj.size,
      uploaded: obj.uploaded.toISOString(),
      etag: obj.httpEtag,
      contentType: obj.httpMetadata?.contentType,
    };
  }
}
