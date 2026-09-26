import z from "zod";
import { links } from "../../db/schema.js";

export const creteLinkRequestSchema = z.object({
  url: z.url(),
});

export const createLinkResponseSchema = z.object({
  id: z.number(),
  url: z.string(),
  slug: z.string(),
  createdAt: z.date(),
});

export const getLinkBySlugRequestSchema = z.object({
  slug: z.string(),
});

export const getLinkBySlugResponseSchema = z
  .object({
    id: z.number(),
    url: z.string(),
    slug: z.string(),
    createdAt: z.date(),
  })
  .nullable();
