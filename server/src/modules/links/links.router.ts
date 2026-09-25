import { publicProcedure, router } from "../../trpc.js";

export const linksRouter = router({
  getAll: publicProcedure.query(async () => {
    return [];
  }),
});
