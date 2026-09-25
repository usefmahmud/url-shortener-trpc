import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./router.js";

const app = new Hono();
const PORT = Number(process.env.PORT ?? 8000);

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
  }),
);

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
