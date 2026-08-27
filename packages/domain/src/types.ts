import { UserRecord } from './features/users/user.type';

export type User = UserRecord;

export interface ApiResponse<T> {
  data: T;
  meta?: {
    timestamp: string;
  };
}
