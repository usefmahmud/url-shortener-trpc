# tRPC URL Shortener — Progress Tracker

Stack: React + TanStack Router (client) · Fastify or Hono (server) · tRPC · zod · SQLite (or in-memory)

Check items off as you go. Each ticket has a "done when" so you know when to stop.

---

## Sprint 0 — Scaffolding

_Goal: both processes run and can talk to each other, no features yet._

- [ ] **TICKET-1: Init server project** Fastify or Hono, TypeScript, `tsx` for dev. Done when: `npm run dev` starts a server on a port with a `/health` route returning 200.
- [ ] **TICKET-2: Add tRPC to the server** `@trpc/server`, adapter for your chosen framework (`@trpc/server/adapters/fastify` or hono's `trpc-server` package), empty `appRouter`. Done when: hitting `/trpc/health` (a trivial ping procedure) returns a valid tRPC JSON response.
- [ ] **TICKET-3: Init client project** Vite + React + TanStack Router, basic route tree with one `/` page. Done when: `npm run dev` shows a blank page with your app title.
- [ ] **TICKET-4: Wire tRPC client to server** `@trpc/client` + `@trpc/react-query`, `httpBatchLink`, type-only `import type { AppRouter }` from the server. Done when: the `/` page calls the `health` procedure and renders its response — this is your proof the type-safe pipe works end to end.

---

## Sprint 1 — Core shortening logic

_Goal: you can create and resolve short links via tRPC, no UI polish, no redirect route yet._

- [ ] **TICKET-5: Data model + store** A `Link` type (`id`, `code`, `targetUrl`, `createdAt`) and a store module (in-memory `Map` is fine to start; swap for SQLite later if you want persistence). Done when: you can call store functions directly in a scratch script and get sane output.
- [ ] **TICKET-6: `shorten` mutation** Input: zod-validated URL (reject non-http(s), reject garbage). Generates a short code (random 6-char base62 is fine), handles collisions (retry on clash). Done when: calling it twice with the same URL gives two different codes, and an invalid URL input throws a clear zod error.
- [ ] **TICKET-7: `resolve` query** Input: code. Output: the target URL or a `NOT_FOUND` TRPCError. Done when: resolving a known code works, resolving an unknown one returns a proper tRPC error (not a 500).
- [ ] **TICKET-8: `listLinks` query** Returns all links, newest first. No pagination needed at this size. Done when: after a few `shorten` calls, `listLinks` reflects all of them in the right order.

---

## Sprint 2 — The redirect route (the interesting bit)

_Goal: a real browser hitting a short link actually redirects — outside the tRPC JSON envelope._

- [ ] **TICKET-9: Plain HTTP redirect route** A route (`GET /:code`, mounted _alongside_ your tRPC handler on the same server, not through it) that looks up the code via the same store, and does a 302 to the target. Done when: pasting `http://localhost:PORT/abc123` into a real browser tab redirects you to the target URL.
- [ ] **TICKET-10: Click logging** On every successful redirect, append a click record (`timestamp`) tied to that link's code. Done when: after a few manual redirects, the store shows a growing click log per code.
- [ ] **TICKET-11: 404 handling for unknown codes** Unknown code hits the redirect route → plain 404 page, not a crash. Done when: `/doesnotexist` returns 404 cleanly.

---

## Sprint 3 — Frontend

_Goal: usable UI — shorten a link, see your list, copy a link._

- [ ] **TICKET-12: Shorten form** Input + submit, calls the `shorten` mutation, shows the resulting short link on success, shows the zod validation error on failure. Done when: submitting a bad URL shows an inline error; submitting a good one shows the new short link.
- [ ] **TICKET-13: Links table** Uses `listLinks`, renders code, target, created date, a copy-to-clipboard button. Done when: newly created links appear in the table without a manual page refresh (refetch on mutation success is fine — no need for subscriptions).
- [ ] **TICKET-14: TanStack Router route for link detail** A `/links/$code` route showing that link's full stats page (stub content OK for now — stats come in Sprint 4). Done when: clicking a row navigates to a real route with the code in the URL and loader-fetched data.

---

## Sprint 4 — Stats & polish

_Goal: the "analytics" part of "URL shortener with click analytics" actually exists._

- [ ] **TICKET-15: `stats` query** Input: code. Output: total click count + last 10 click timestamps. Done when: the `/links/$code` page shows a real click count that increases as you redirect through the short link.
- [ ] **TICKET-16: Simple chart or list of recent clicks** Doesn't need to be fancy — a list of relative timestamps ("2 minutes ago") is enough. Done when: the detail page shows both the total and a visible recent-activity list.
- [ ] **TICKET-17: Delete link** Mutation + button, removes the link and its click history. Done when: deleting a link removes it from the table and its short URL 404s afterward.
- [ ] **TICKET-18 (stretch): Swap in-memory store for SQLite** Only if you want persistence across restarts. Router code shouldn't need to change, just the store implementation — a good check that you actually decoupled them.

---

## What "done" looks like

You can: paste a URL in the browser → get a short link → open it in a new tab and get redirected → come back and see the click count go up → delete the link and confirm it 404s.
