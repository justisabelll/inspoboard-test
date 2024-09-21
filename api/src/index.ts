import { Elysia, t as T } from 'elysia';
import { compile as c, trpc } from '@elysiajs/trpc';
import { initTRPC } from '@trpc/server';
const trpcInstance = initTRPC.create();
const procedure = trpcInstance.procedure;

const router = trpcInstance.router({
  greet: procedure
    .input(c(T.String()))
    .query(({ input }) => `Hello, ${input}!`),
});

export type Router = typeof router;

const app = new Elysia().use(trpc(router)).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
