import { ErrorHandler } from 'hono';

export const errorHandler: ErrorHandler = (err, c) => {
  console.error(`[Gateway Error] ${c.req.method} ${c.req.url}:`, err);
  return c.json({
    error: {
      message: err.message || 'Internal Server Error',
      status: 500,
      timestamp: new Date().toISOString()
    }
  }, 500);
};
