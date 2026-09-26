import { cacheLink, getCachedLink } from "./links.cache.js";
import {
  createLink as createLinkRecord,
  findLinkBySlug,
} from "./links.repository.js";

export async function createLink(url: string) {
  const link = await createLinkRecord(url);

  await cacheLink(link);

  return link;
}

export async function getLinkBySlug(slug: string) {
  const cachedLink = await getCachedLink(slug);

  if (cachedLink) {
    return cachedLink;
  }

  const link = await findLinkBySlug(slug);

  if (link) {
    await cacheLink(link);
  }

  return link ?? null;
}
