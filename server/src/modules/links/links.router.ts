import { publicProcedure, router } from "../../trpc.js";
import { db, links } from "../../db/index.js";
import {
  createLinkResponseSchema,
  creteLinkRequestSchema,
  getLinkBySlugRequestSchema,
  getLinkBySlugResponseSchema,
} from "./links.schema.js";
import { nanoid } from "../../utils/index.js";

export const linksRouter = router({
  create: publicProcedure
    .input(creteLinkRequestSchema)
    .output(createLinkResponseSchema)
    .mutation(async ({ input }) => {
      const [link] = await db
        .insert(links)
        .values({
          url: input.url,
          slug: nanoid(),
        })
        .returning();

      return link;
    }),

  getLinkBySlug: publicProcedure
    .input(getLinkBySlugRequestSchema)
    .output(getLinkBySlugResponseSchema)
    .query(async ({ input }) => {
      const link = await db.query.links.findFirst({
        where: (links, { eq }) => eq(links.slug, input.slug),
      });

      return link ?? null;
    }),
});
