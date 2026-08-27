export interface StorageObjectMetadata {
  key: string;
  size: number;
  uploaded: string;
  etag?: string;
  contentType?: string;
}
