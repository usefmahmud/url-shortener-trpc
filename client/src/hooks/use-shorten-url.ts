import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";

export const useShortenUrl = () => {
  return useMutation(trpc.links.create.mutationOptions());
};
