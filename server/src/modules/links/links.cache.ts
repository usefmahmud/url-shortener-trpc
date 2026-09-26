import type { Link } from "../../db/schema.js";
import { redis } from "../../redis.js";

const LINK_CACHE_TTL = 60 * 60; // 1 hour caching;

function getLinkCacheKey(slug: string) {
  return `link:${slug}`;
}

export async function getCachedLink(slug: string): Promise<Link | null> {
  if (!redis.isReady) {
    return null;
  }

  try {
    const cachedLink = await redis.get(getLinkCacheKey(slug));

    if (!cachedLink) {
      return null;
    }

    const parsedLink = JSON.parse(cachedLink) as Link;

    return {
      ...parsedLink,
      createdAt: new Date(parsedLink.createdAt),
    };
  } catch (error) {
    console.error("Failed to read link from Redis", error);

    return null;
  }
}

export async function cacheLink(link: Link) {
  if (!redis.isReady) {
    return;
  }

  console.log("Caching link in Redis", link);

  try {
    await redis.set(getLinkCacheKey(link.slug), JSON.stringify(link), {
      EX: LINK_CACHE_TTL,
    });
  } catch (error) {
    console.error("Failed to cache link in Redis", error);
  }
}
