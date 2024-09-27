import { AppRouter } from '@inspoboard/api/src/index';
import { hc } from 'hono/client';

export const client = hc<AppRouter>(import.meta.env.API_URL);
