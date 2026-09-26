import { Hono } from "hono";
import { cors } from "hono/cors";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./router.js";
import { connectRedis } from "./redis.js";

export const app = new Hono();

app.use(
  "*",
  cors({
    origin: process.env.ALLOWED_ORIGIN ?? "http://localhost:3330",
  }),
);

app.use("*", async (c, next) => {
  await connectRedis();
  await next();
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
  }),
);
