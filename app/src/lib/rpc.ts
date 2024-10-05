import { AppRouter } from '@inspoboard/api/src/index';
import { hc } from 'hono/client';

const url = import.meta.env.VITE_API_URL;

if (!url) {
  if (import.meta.env.DEV) {
    throw new Error('VITE_API_URL is not set');
  } else {
    console.error('VITE_API_URL is not set');
  }
}

export const client = hc<AppRouter>(import.meta.env.VITE_API_URL);
