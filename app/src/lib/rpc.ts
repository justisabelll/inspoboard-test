import { AppRouter } from '@inspoboard/api/src/index';
import { hc } from 'hono/client';

export const client = hc<AppRouter>('http://localhost:3000/');
