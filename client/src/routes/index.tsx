import { createFileRoute } from "@tanstack/react-router";
import { Link2, Sparkles } from "lucide-react";
import { BackgroundGrid } from "../components/layout/background-grid";
import { ShortenUrlForm } from "../components/shorten-url/shorten-url-form";

const HomeComponent = () => {
  return (
    <main className="relative min-h-svh overflow-hidden bg-[#090b0f] text-white">
      <BackgroundGrid />

      <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6 py-7 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2.5 text-sm font-semibold tracking-tight"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-cyan-300 text-slate-950 shadow-[0_0_28px_rgba(103,232,249,0.25)]">
              <Link2 className="size-4" strokeWidth={2.5} />
            </span>
            shortly<span className="text-cyan-300">.</span>
          </a>
          <div className="hidden items-center gap-2 text-xs text-white/45 sm:flex">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Fast, simple, free
          </div>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center pb-16 pt-20 text-center sm:pt-24">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4.5 px-3.5 py-2 text-xs font-medium text-cyan-200/90 backdrop-blur-sm">
            <Sparkles className="size-3.5" />
            Make every link count
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.06em] text-balance sm:text-7xl">
            Links that are <span className="text-cyan-300">shorter.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/50 sm:text-lg">
            Turn long, messy URLs into clean links that are easy to share,
            remember, and follow.
          </p>

          <ShortenUrlForm />
        </section>

        <footer className="flex items-center justify-between border-t border-white/10 pt-5 text-xs text-white/30">
          <span>Short links, less noise.</span>
          <span>Built for the web</span>
        </footer>
      </div>
    </main>
  );
};

export const Route = createFileRoute("/")({
  component: HomeComponent,
});
