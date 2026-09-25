import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./router.js";
import { renderTrpcPanel } from "trpc-ui";

const app = new Hono();
const PORT = Number(process.env.PORT ?? 8000);

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
  }),
);

app.get("/trpc-panel", async (c) => {
  return c.html(
    renderTrpcPanel(appRouter, {
      url: `http://localhost:${PORT}/trpc`,
    }),
  );
});

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
