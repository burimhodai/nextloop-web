<!-- .github/copilot-instructions.md - guidance for AI coding agents -->

# Copilot / AI Agent Instructions — NextLoop Web

Purpose: concise, actionable pointers to be immediately productive in this Next.js 16 (app-router) codebase.

Big picture

- App uses Next.js 16 app-router under `app/`. Root layout mounts a `SessionProvider` and `Header` (see [app/layout.tsx](app/layout.tsx#L1)).
- UI components live in `components/` (grouped subfolders: `auth`, `listings`, `profile`, `ui`).
- Client state: `zustand` persisted store at `lib/stores/authStore.ts` — authentication, token, and hydration are handled there.
- API layer: lightweight helper services under `services/` (e.g., `services/listings/index.ts`) — use these rather than calling APIs inline in components.

Key conventions and patterns

- App Router: prefer server components in `app/` where practical, and mark client-side behavior with `"use client"` at file top (examples: provider and forms in `components/*`).
- Session flow: `components/providers/SesasionProvider.tsx` (note the filename typo `SesasionProvider`) reads `useAuthStore` and redirects unauthenticated users to `/auth/login`.
- Persisted auth: `useAuthStore` uses `persist` with `onRehydrateStorage` and exposes actions `login`, `signup`, `logout` — modify only when you understand rehydration implications.
- API config: base URL comes from `process.env.NEXT_PUBLIC_API_URL` (default `http://localhost:5000`) — services use `fetch` and expect JSON responses.
- Listing helpers: `services/listings/index.ts` includes many helpful helpers (e.g., `getMainImage`, `getListingUrl`, `getMinimumBid`) — reuse these to keep UI logic DRY.

Developer workflows (commands)

- Start dev server: `npm run dev` -> runs `next dev` (hot reloads, app router).
- Build for production: `npm run build` then `npm run start`.
- Lint: `npm run lint` (uses `eslint`).

Files to inspect for common tasks

- Authentication wiring: [lib/stores/authStore.ts](lib/stores/authStore.ts#L1)
- Session provider and route protection: [components/providers/SesasionProvider.tsx](components/providers/SesasionProvider.tsx#L1)
- Listing API + helpers: [services/listings/index.ts](services/listings/index.ts#L1)
- App entry: [app/layout.tsx](app/layout.tsx#L1) and `app/page.tsx` for home UI.

Project-specific gotchas

- `SesasionProvider` filename is misspelled in the repo import; search and preserve consistent casing/name when refactoring.
- `useAuthStore` persists only `user`, `token`, `isAuthenticated`. Other transient fields (errors, isLoading) are intentionally not persisted.
- Many service functions throw on non-OK responses after parsing JSON — callers should `try/catch` and surface friendly UI errors.

How to add features safely

- Add API wrappers to `services/` and keep components thin; prefer returning typed interfaces from service functions (see `IListing` and related types in `lib/types`).
- When changing auth store behavior, ensure `onRehydrateStorage` and `_hasHydrated` logic remain consistent to avoid redirect loops.
- For redirecting unauthenticated users, follow the `publicRoutes` list in `SesasionProvider` to avoid accidental lockouts.

Useful code examples

- Call search API:

```ts
import { searchListings } from "@/services/listings";
const results = await searchListings({ q: "watch", page: 1, limit: 20 });
```

- Use auth store login:

```ts
import { useAuthStore } from "@/lib/stores/authStore";
await useAuthStore.getState().login({ email, password });
```

Testing & linting

- No tests in repo currently. Run `npm run lint` to check ESLint rules. Keep changes TypeScript-typed and run the dev server to verify app-router routes.

If anything is unclear or you'd like more examples (e.g., common refactors, CI steps), tell me which areas to expand.
