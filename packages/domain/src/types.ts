export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  meta?: {
    timestamp: string;
  };
}
