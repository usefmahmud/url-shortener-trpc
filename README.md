# shortly — URL shortener for exploring tRPC

A small full-stack URL shortener whose real purpose is to explore **tRPC** end to end:
type-safe procedures shared between a Hono server and a React client, wired into
TanStack Query, TanStack Router, Postgres and Redis.

Paste a long URL → get an 8-character short link → opening the short link redirects
you to the original URL.

## Stack

| Layer     | Tech |
|-----------|------|
| Client    | React 19, Vite, TanStack Router (file-based), TanStack Query, Tailwind CSS 4, react-hook-form + zod |
| tRPC      | `@trpc/server` 11, `@hono/trpc-server`, `@trpc/client`, `@trpc/tanstack-react-query` |
| Server    | Hono + `@hono/node-server`, TypeScript (ESM), zod 4 |
| Data      | PostgreSQL via Drizzle ORM (`pg`) |
| Cache     | Redis (`redis` client, cache-aside with 1h TTL) |

## Project layout

```
├── client/                  # Vite + React SPA
│   └── src/
│       ├── routes/          # file-based routes: / and /$slug
│       ├── components/      # providers, shorten form, ui primitives
│       ├── hooks/           # useShortenUrl (tRPC mutation)
│       ├── schemas/         # zod schema for the form
│       └── utils/trpc.ts    # tRPC client + options proxy
├── server/                  # Hono + tRPC API
│   └── src/
│       ├── app.ts           # Hono app: CORS, Redis connect, tRPC mount
│       ├── server.ts        # Node entry (port 8000)
│       ├── trpc.ts          # t init (router, publicProcedure)
│       ├── router.ts        # appRouter + exported AppRouter type
│       ├── modules/links/   # router → service → repository/cache
│       ├── db/              # Drizzle client + schema
│       └── redis.ts         # Redis client
└── docs/tracking.md         # original sprint plan / roadmap
```

## tRPC API

Mounted at `http://localhost:8000/trpc` behind an `httpBatchLink`.

| Procedure            | Type     | Input            | Output                    |
|----------------------|----------|------------------|---------------------------|
| `links.create`       | mutation | `{ url }`        | `{ id, url, slug, createdAt }` |
| `links.getLinkBySlug`| query    | `{ slug }`       | link object or `null`     |

Both procedures validate input **and** output with zod schemas defined next to the
procedure (`server/src/modules/links/links.schema.ts`).

## How it works

**Shortening** — the form calls the `links.create` mutation. The repository inserts a
row into `links` with a nanoid-generated 8-char base62 slug, the service writes the
result into Redis (`link:<slug>`, 1 hour TTL), and the client renders the short URL
with a copy-to-clipboard button.

**Redirecting** — visiting `/:slug` runs a TanStack Router route loader that calls
`links.getLinkBySlug` directly (no React needed for the lookup). The service checks
Redis first, falls back to Postgres, and re-caches on a hit. The loader then either
`redirect()`s to the target URL or throws `notFound()`. Because the lookup is a plain
query, the same data path serves both the SPA and future server-side redirect routes.

**Type safety** — the client imports the router type only:

```ts
import type { AppRouter } from "../../../server/src/router";
```

`createTRPCClient<AppRouter>` and `createTRPCOptionsProxy<AppRouter>` then give
end-to-end types: procedure names, input and output are checked at compile time, with
no codegen step. The import is erased at build time, so the client never bundles the
server.

On the client, tRPC plugs into TanStack Query via `trpc.links.create.mutationOptions()`
used with a plain `useMutation` (see `client/src/hooks/use-shorten-url.ts`).

## Getting started

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL (local or hosted, e.g. Neon)
- Redis (local or hosted, e.g. Upstash/Redis Cloud)

### 1. Server

```bash
cd server
pnpm install
cp .env.example .env        # then fill in DATABASE_URL and REDIS_URL
pnpm run db:push            # push the Drizzle schema (links table) to Postgres
pnpm exec tsx watch src/server.ts
```

The API is now on <http://localhost:8000> (`/trpc`).

### 2. Client

```bash
cd client
pnpm install
pnpm run dev
```

The app is now on <http://localhost:3330>.

### Environment variables

**server/.env**

```
PORT=8000
DATABASE_URL=postgresql://user:password@localhost:5432/url_shortener
REDIS_URL=redis://localhost:6379
```

**client/.env** (already committed — points at the local API)

```
VITE_TRPC_URL=http://localhost:8000/trpc
```

CORS on the server allows the client origin (`ALLOWED_ORIGIN`, default
`http://localhost:3330`). Redis failures are non-fatal: lookups fall back to Postgres
and caching resumes when the connection is back.

### Database schema

```sql
links (
  id          serial PRIMARY KEY,
  url         text NOT NULL,
  slug        text NOT NULL UNIQUE,
  created_at  timestamptz NOT NULL DEFAULT now()
)
```

Managed with Drizzle Kit — `pnpm run db:push` applies schema changes.

## Deployment

Both apps are prepared for Vercel:

- **server** — `server/api/index.ts` wraps the Hono app with
  `getRequestListener(app.fetch)`; `server/vercel.json` routes `/trpc/*` to it.
- **client** — `client/vercel.json` rewrites all paths to `index.html` (SPA), which is
  also what makes `/:slug` resolve in a deployed short link.

Set `DATABASE_URL`, `REDIS_URL` and `ALLOWED_ORIGIN` (your deployed client origin) in
the server project's environment, plus `VITE_TRPC_URL` (your deployed `/trpc` URL) for
the client.

## Status / roadmap

Core loop works: shorten → share → redirect, with Postgres persistence and Redis
caching. Remaining tickets (click logging, link list, stats page, delete, and a plain
server-side `GET /:slug` redirect outside the SPA) are tracked in
[`docs/tracking.md`](docs/tracking.md).
