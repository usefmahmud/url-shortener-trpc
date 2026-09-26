import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useShortenUrl } from "../../hooks/use-shorten-url";
import {
  shortenUrlSchema,
  type ShortenUrlFormValues,
} from "../../schemas/shorten-url";

export const ShortenUrlForm = () => {
  const shortenUrl = useShortenUrl();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShortenUrlFormValues>({
    resolver: zodResolver(shortenUrlSchema),
    defaultValues: { url: "" },
  });

  const onSubmit = ({ url }: ShortenUrlFormValues) => {
    shortenUrl.mutate(url);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 w-full max-w-2xl"
        noValidate
      >
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/6 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl sm:flex-row">
          <Input
            type="url"
            {...register("url")}
            placeholder="Paste your long URL here..."
            aria-label="URL to shorten"
            aria-invalid={Boolean(errors.url)}
            className="h-12 border-0 bg-transparent px-4 text-sm text-white shadow-none placeholder:text-white/30 focus-visible:border-0 focus-visible:ring-0"
          />
          <Button
            type="submit"
            size="lg"
            disabled={shortenUrl.isPending}
            className="h-12 rounded-xl bg-cyan-300 px-5 font-semibold text-slate-950 hover:bg-cyan-200"
          >
            {shortenUrl.isPending ? "Shortening..." : "Shorten URL"}
            {shortenUrl.isPending ? null : <ArrowRight className="size-4" />}
          </Button>
        </div>
        {errors.url && (
          <p className="mt-2 text-left text-xs text-rose-300">
            {errors.url.message}
          </p>
        )}
      </form>

      {shortenUrl.data && (
        <div
          aria-live="polite"
          className="mt-5 flex w-full max-w-2xl items-center justify-between gap-4 rounded-xl border border-emerald-400/20 bg-emerald-400/8 px-4 py-3 text-left sm:px-5"
        >
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-emerald-300/70">
              Your shortened link
            </p>
            <p className="mt-1 truncate text-sm font-medium text-emerald-100">
              {shortenUrl.data}
            </p>
          </div>
          <Check className="size-5 shrink-0 text-emerald-300" />
        </div>
      )}
    </>
  );
};
