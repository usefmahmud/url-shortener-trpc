import { router } from "./trpc.js";
import { linksRouter } from "./modules/links/links.router.js";

export const appRouter = router({
  links: linksRouter,
});

export type AppRouter = typeof appRouter;
