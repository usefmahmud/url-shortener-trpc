import { httpBatchLink, createTRPCClient } from "@trpc/client";
import { useState, type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type AppRouter } from "../../../server/src/router";
import { queryClient } from "../utils/trpc";

const createQueryClient = () => new QueryClient();

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
