import { z } from "zod";

export const shortenUrlSchema = z.object({
  url: z.string().trim().url("Enter a valid URL"),
});

export type ShortenUrlFormValues = z.infer<typeof shortenUrlSchema>;
