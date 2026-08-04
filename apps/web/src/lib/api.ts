import { hc } from 'hono/client';
import type { AppType } from '@template/gateway';

// Access gateway API on self domain during Worker Assets routing execution
export const api = hc<AppType>('/');
