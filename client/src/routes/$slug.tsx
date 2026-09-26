import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { trpcClient } from "../utils/trpc";

export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const link = await trpcClient.links.getLinkBySlug.query({
      slug: params.slug,
    });

    if (!link) {
      throw notFound();
    }

    throw redirect({
      href: link.url,
    });
  },
});
