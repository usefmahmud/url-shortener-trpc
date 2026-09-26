import { db, links } from "../../db/index.js";
import { nanoid } from "../../utils/index.js";

export async function createLink(url: string) {
  const [link] = await db
    .insert(links)
    .values({
      url,
      slug: nanoid(),
    })
    .returning();

  return link;
}

export async function findLinkBySlug(slug: string) {
  return db.query.links.findFirst({
    where: (links, { eq }) => eq(links.slug, slug),
  });
}
