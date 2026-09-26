import { publicProcedure, router } from "../../trpc.js";
import {
  createLinkResponseSchema,
  creteLinkRequestSchema,
  getLinkBySlugRequestSchema,
  getLinkBySlugResponseSchema,
} from "./links.schema.js";
import { createLink, getLinkBySlug } from "./links.service.js";

export const linksRouter = router({
  create: publicProcedure
    .input(creteLinkRequestSchema)
    .output(createLinkResponseSchema)
    .mutation(async ({ input }) => {
      return createLink(input.url);
    }),

  getLinkBySlug: publicProcedure
    .input(getLinkBySlugRequestSchema)
    .output(getLinkBySlugResponseSchema)
    .query(async ({ input }) => {
      return getLinkBySlug(input.slug);
    }),
});
