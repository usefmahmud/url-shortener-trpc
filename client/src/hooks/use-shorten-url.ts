import { useMutation } from "@tanstack/react-query";

export const useShortenUrl = () => {
  return useMutation({
    mutationFn: async (url: string) => {
      await new Promise((resolve) => setTimeout(resolve, 450));

      return `done`;
    },
  });
};
