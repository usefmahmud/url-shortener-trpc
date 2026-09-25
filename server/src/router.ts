import { initTRPC } from "@trpc/server";
import { linksRouter } from "./modules/links/links.router.js";

const t = initTRPC.create();

export const publicProcedure = t.procedure;
export const router = t.router;

export const appRouter = router({
  links: linksRouter,
});

export type AppRouter = typeof appRouter;
