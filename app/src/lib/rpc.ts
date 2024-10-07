import type { AppRouter } from '../../../api/src/index';
import { hc } from 'hono/client';

const url = import.meta.env.VITE_API_URL;

if (!url) {
  throw new Error('VITE_API_URL is not set');
}

export const client = hc<AppRouter>(url);
