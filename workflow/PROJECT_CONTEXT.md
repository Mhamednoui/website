# PROJECT_CONTEXT.md

> Paste this file at the start of every new AI session. No intro needed — just paste it.

---

# Project Overview

- **Name:** ExamPlatform (working title)
- **Goal:** Digital preparation platform for risk perception tests and QCM exams
- **Target outcome:** Full-stack web app + mobile app with secure video streaming, interactive QCM exams, hybrid subscription system (3 months OR 1,000 clicks), admin back-office, and Stripe payments
- **Client:** [someone / "personal project"]
- **Deadline:** [unknown or "TBD"]

---

# Tech Stack & Architecture

### Frontend

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Video:** Video.js + HLS.js
- **HTTP:** Axios (with JWT interceptor + auto-refresh)

### Backend

- **Runtime:** Node.js + Express.js (TypeScript)
- **ORM:** Prisma
- **DB:** PostgreSQL (Docker) + Redis (Docker, via Bull queue)
- **Auth:** JWT (access token in memory, refresh token in httpOnly cookie)
- **Validation:** Zod
- **Payments:** Stripe (primary) + PayPal (secondary)
- **Email:** Resend
- **File storage:** AWS S3 + CloudFront (signed HLS URLs)

### Mobile

- **Framework:** React Native (Expo)
- **Navigation:** Expo Router
- **Push notifications:** Expo Notifications

### Infrastructure

- **Frontend hosting:** Vercel
- **Backend hosting:** Railway.app
- **DB hosting:** Railway PostgreSQL (prod) / Docker (local)
- **CDN/Video:** AWS CloudFront
- **CI/CD:** GitHub Actions
- **Monitoring:** Sentry

### Folder Structure

```
exam-platform/
  docker-compose.yml
  backend/
    prisma/schema.prisma
    src/
      routes/ controllers/ services/ middleware/ jobs/ utils/
    .env
  frontend/
    src/app/
      (auth)/login, register
      (dashboard)/dashboard, courses, videos, exams, profile, pricing
      (admin)/users, videos, courses, exams, stats
    src/components/ stores/ lib/ hooks/ types/
    .env.local
  mobile/
    app/ components/ stores/ lib/
  docs/
```

### Key Business Rules

- 1 click = 1 QCM question loaded (not per answer)
- Subscription expires on EITHER: `expires_at` passed OR `clicks_remaining = 0`
- Notification thresholds: 80% used (200 left), 95% used (50 left), 100% (0 left)
- Reviewing results after submission does NOT consume clicks
- Admin can manually adjust clicks or extend subscriptions

---

# Current State Snapshot

> ⚠️ **Update this section every session.** Max 300 words. This is the first thing the AI reads.

Last updated: 2026-05-21
Overall progress: ~50% / Video player page complete

Backend: All auth routes working. Course + Video models migrated. Routes /api/courses and /api/videos fully wired with protect + requireSubscription. New endpoint POST /api/videos/:id/stream-url returns hlsUrl directly now (Phase 1); designed to swap to CloudFront signed URLs (Phase 2) with zero route/controller changes — only video.service.ts getStreamUrl() needs updating. Frontend: Courses page complete. Videos page complete with course filter tabs — video cards now link to /videos/[id]. Video player page at (dashboard)/videos/[id]/page.tsx complete: fetches metadata + stream URL in parallel, Video.js + HLS.js initialized via dynamic import (no SSR), custom indigo-themed CSS overrides, four states handled (loading skeleton, error, no_stream, ready). VideoPlayer.tsx is a reusable component with proper cleanup on unmount. next.config.ts has webpack fallback for video.js browser bundle. No real video data seeded yet — player will show "coming soon" state until hlsUrl is set in DB.

updated: 2026-05-21
Overall progress: ~40% / Courses + Videos pages complete, bugs fixed

Backend: All auth routes working. Course and Video models added to Prisma schema and migrated. Routes /api/courses and /api/videos fully wired with protect + requireSubscription middleware. Controllers fixed: req.params destructured correctly to avoid string | string[] TS error. Prisma generate must be run after migration for course/video accessors to appear. Frontend: Courses page complete — grid of course cards, subscription gate, skeleton loading. Videos page complete — course filter tabs + video grid, subscription gate, skeleton loading, hover play overlay, duration badge. setState-in-effect lint error fixed using Promise.resolve().then() deferral + cancelled flag pattern. Shared types in src/types/index.ts. SubscriptionWall reusable component done. No video player yet — clicking a video card does nothing.

updated: 2026-05-19
Overall progress: ~30% / Dashboard shell complete

Backend: /api/auth/me added (GET, protected). All auth routes working: register, login, logout, refresh, me. Frontend: full auth flow working — Axios instance with auto-refresh interceptor, Zustand authStore with hydrate() action, Providers component runs hydrate() on app load. Next.js middleware.ts handles route protection via refreshToken cookie. Root page redirects to /dashboard. Dashboard layout complete: dark sidebar (slate-950/900), responsive with mobile drawer, shows admin link for ADMIN role. Dashboard home page complete with stat cards and subscription banner. lucide-react installed. No real data wired yet — all stats are placeholders.

updated: 2026-05-19
Overall progress: ~20% / Frontend auth in progress

Backend fully running on port 3001, health check confirmed. Prisma 7 with PrismaPg adapter, auth routes all working. Frontend started: Axios instance with auto-refresh interceptor done (src/lib/axios.ts), Zustand auth store done (src/stores/authStore.ts), login page done at (auth)/login/page.tsx accessible at /login. Register page at (auth)/register/page.tsx accessible at /register. No dashboard or protected routes yet.

updated: 2026-05-19
Overall progress: ~15% / Backend auth complete

Backend is fully running on port 3001. Server health check confirmed working at /health. We are using Prisma 7 which has breaking changes from older versions: datasource url is no longer in schema.prisma — it lives in prisma.config.ts using defineConfig. Prisma 7 also requires a database adapter (PrismaPg from @prisma/adapter-pg) passed to the PrismaClient constructor. PrismaClient is imported from node_modules/.prisma/client/index.js directly (not from @prisma/client) due to Prisma 7 export changes. Auth system is fully implemented: register, login, logout, and refresh token with rotation. Access token returned in response body, refresh token in httpOnly cookie (7 days). JWT protect and requireAdmin middleware are ready. Frontend auth not started yet.

---

# Session Log

> Reverse chronological. Most recent session at the TOP. One entry per session.

---

### Session 6 — 2026-05-21

**Implemented:**

- Backend: getStreamUrl() in video.service.ts — returns hlsUrl (Phase 1, CloudFront-ready)
- Backend: getStreamUrl controller + POST /api/videos/:id/stream-url route (protect + requireSubscription)
- Frontend: VideoPlayer.tsx — Video.js + HLS.js, dynamic import (no SSR), proper dispose on unmount
- Frontend: globals.css — Video.js dark theme overrides (indigo accent, gradient control bar)
- Frontend: (dashboard)/videos/[id]/page.tsx — parallel fetch, 4 state machine (loading/error/no_stream/ready)
- Frontend: videos/page.tsx — video cards converted from div to Link pointing to /videos/[id]
- Frontend: next.config.ts — webpack fs/net/tls fallback for video.js browser bundle
- Backend: npm install @aws-sdk/cloudfront-signer (ready for Phase 2)
- Frontend: npm install video.js videojs-http-streaming @types/video.js

**Key decisions:**

- stream-url is POST not GET — semantically it "creates" a temporary signed resource
- Video.js initialized via createElement('video-js') pattern — avoids React hydration conflicts
- dynamic() with ssr:false — video.js cannot run in Node.js/SSR context
- State machine pattern (loading/error/no_stream/ready) instead of multiple booleans — cleaner and exhaustive
- Parallel Promise.all for video metadata + stream URL — faster page load
- getStreamUrl() isolated in service layer — Phase 2 CloudFront upgrade touches only that one function

**Files created/modified:**

- backend/src/services/video.service.ts
- backend/src/controllers/video.controller.ts
- backend/src/routes/video.routes.ts
- frontend/src/components/VideoPlayer.tsx (new)
- frontend/src/app/globals.css
- frontend/src/app/(dashboard)/videos/[id]/page.tsx (new)
- frontend/src/app/(dashboard)/videos/page.tsx
- frontend/next.config.ts

**Blockers / open questions:**

- No real HLS video data in DB yet — player shows "coming soon" until hlsUrl is seeded
- CloudFront signed URLs (Phase 2) not implemented — waiting on AWS setup

**🔜 Next steps for AI:**

1. Ask for current file tree and any errors
2. Build GET /api/subscriptions/me + wire dashboard stat cards to real data
3. Build /pricing page (static UI, no Stripe yet)
4. Then Day 9: QCM exam engine backend

### Session 5 — 2026-05-21

**Implemented:**

- Fixed TS error in course/video controllers: destructure req.params instead of passing directly
- Fixed Prisma accessor error: prisma.course / prisma.video only available after `npx prisma generate`
- Fixed React lint error in videos page: setVideosLoading moved out of synchronous effect body using Promise.resolve().then() deferral + cancelled flag + AbortController cleanup

**Key decisions:**

- Promise.resolve().then() pattern defers setState out of synchronous effect body without adding dependencies
- cancelled flag prevents stale state updates if effect re-runs before fetch completes
- AbortController wired up for future fetch cancellation (axios doesn't use it yet but the ref is in place)

**Files created/modified:**

- backend/src/controllers/course.controller.ts
- backend/src/controllers/video.controller.ts
- frontend/src/app/(dashboard)/videos/page.tsx

**Blockers / open questions:**

- None

**🔜 Next steps for AI:**

1. Ask for current file tree and any errors
2. Build video player page at (dashboard)/videos/[id]/page.tsx using Video.js + HLS.js
3. Build (dashboard)/exams/page.tsx

### Session 3 — 2026-05-19

**Implemented:**

- Backend: GET /api/auth/me (protect middleware + prisma user lookup)
- Frontend: authStore hydrate() action (refresh → /me on app load)
- Frontend: Providers component (runs hydrate on mount)
- Frontend: layout.tsx updated to wrap with Providers
- Frontend: middleware.ts (edge route protection via refreshToken cookie)
- Frontend: page.tsx replaced (redirects / → /dashboard)
- Frontend: (dashboard)/layout.tsx — dark sidebar, mobile drawer, admin link
- Frontend: (dashboard)/dashboard/page.tsx — stat cards + subscription banner

**Key decisions:**

- hydrate() calls /refresh first (to get access token) then /me (to get user) — two calls but clean separation
- middleware uses refreshToken cookie as auth proxy (can't verify JWT at edge without secret)
- Admin route protection is client-side in layout (role in memory, not in cookie)
- Dark theme: slate-950 bg, slate-900 sidebar, indigo-600 accent

**Files created/modified:**

- backend/src/controllers/auth.controller.ts (added me export)
- backend/src/routes/auth.routes.ts (added GET /me)
- frontend/src/stores/authStore.ts (added isHydrated + hydrate())
- frontend/src/components/providers.tsx
- frontend/src/app/layout.tsx
- frontend/src/middleware.ts
- frontend/src/app/page.tsx
- frontend/src/app/(dashboard)/layout.tsx
- frontend/src/app/(dashboard)/dashboard/page.tsx

**Blockers / open questions:**

- None

**🔜 Next steps for AI:**

1. Ask for current file tree and any errors encountered
2. Build (dashboard)/courses/page.tsx
3. Build (dashboard)/videos/page.tsx

### Session 2 — 2026-05-19

**Implemented:**

- Prisma schema (User, RefreshToken, Subscription, Role enum)
- prisma.config.ts with defineConfig and DATABASE_URL (Prisma 7 requirement)
- PrismaPg adapter wired into PrismaClient (Prisma 7 requirement)
- Token utilities (generate access, generate refresh, verify, rotate)
- Auth service (register, login, logout)
- Auth controller with Zod validation
- Auth routes: POST /api/auth/register|login|refresh|logout
- protect + requireAdmin middleware
- app.ts with CORS, cookieParser, express.json
- server.ts running on port 3001
- Health check confirmed working at GET /health

**Key decisions:**

- Prisma 7 is installed — has 3 breaking changes vs older Prisma:
  1. datasource url moved out of schema.prisma → into prisma.config.ts
  2. PrismaClient requires an adapter (PrismaPg) in constructor
  3. PrismaClient must be imported from node_modules/.prisma/client/index.js
- Refresh token rotation on every /refresh call
- Access token in response body (kept in memory on frontend)
- Refresh token in httpOnly cookie (7 days)
- bcrypt cost factor 12
- ENV vars are: JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, FRONTEND_URL, PORT=3001

**Files created/modified:**

- backend/prisma/schema.prisma
- backend/prisma.config.ts
- backend/src/lib/prisma.ts
- backend/src/utils/token.ts
- backend/src/services/auth.service.ts
- backend/src/controllers/auth.controller.ts
- backend/src/routes/auth.routes.ts
- backend/src/middleware/protect.ts
- backend/src/app.ts
- backend/src/server.ts
- backend/.env

**Blockers / open questions:**

- None

**🔜 Next steps for AI:**

1. Before starting, ask for: frontend/package.json, frontend/.env.local, frontend/src/app folder structure
2. Build frontend auth: Zustand auth store, Axios interceptor with auto-refresh, login page, register page

---

# AI Context Restoration Rules

> For the AI — read this when the file is pasted at the start of a session.

1. **Read in this order:** Overview → Tech Stack → Current State Snapshot → top Session Log entry only
2. **The Snapshot is ground truth.** It reflects the real current state. If it conflicts with an older log entry, trust the Snapshot.
3. **The top Session Log entry tells you what to do next.** The `🔜 Next steps for AI` field is your first task. Ask for clarification only if it is genuinely ambiguous.
4. **Do not re-explain what has already been done.** Acknowledge the state briefly, then proceed.
5. **When writing code**, always use the exact file paths from the Folder Structure in the Tech Stack section.
6. **Never suggest changing the tech stack** unless the user explicitly raises it.
7. **After completing each task**, tell the user exactly what to add to this file (see last section of this document).
8. **If a blocker is listed**, address it first or ask the user if it is resolved before proceeding.

---

# Maintenance & Truncation Rules

> For you (the developer) — how to keep this file useful and under ~1,500 words.

### When to update

| Trigger                  | Action                                        |
| ------------------------ | --------------------------------------------- |
| End of every session     | Add new Session Log entry at the TOP          |
| After every session      | Rewrite the Current State Snapshot            |
| After a major decision   | Update Tech Stack section if anything changed |
| File exceeds 1,500 words | Archive old log entries (see below)           |

### How to truncate when the file gets too long

1. Keep the **3 most recent** Session Log entries in full
2. Older entries → compress to one line and move to a separate file called `SESSION_ARCHIVE.md`:

```
### Session 2 — 2024-01-16: Docker + dev environment setup. All tools installed. Repo created.
### Session 1 — 2024-01-15: Project scoped. Tech stack chosen. Blueprint created.
```

3. Add one line at the bottom of the Session Log: `> Older entries archived in SESSION_ARCHIVE.md`

### What to NEVER remove

- The entire Tech Stack section (AI needs this every session)
- The Current State Snapshot (most critical section)
- The top 3 Session Log entries
- The AI Context Restoration Rules
- Open blockers (❓) until they are resolved

### What to compress aggressively

- Resolved blockers — delete them once resolved
- Files created/modified lists older than 3 sessions — remove
- Rationale notes older than 3 sessions — summarize to one sentence

### Keeping the Snapshot accurate

The Snapshot is only useful if it is honest. Write it as if you are telling a colleague who has never seen the project exactly where it stands — what works, what doesn't, and what is next. Do not pad it with things that are "planned."

---

# 🔁 End-of-Session Update Instructions

> The AI will always end each session by telling you exactly what to paste into this file.

At the end of every session, the AI will output a ready-to-paste block like this:

---

**📋 Update your PROJECT_CONTEXT.md with the following:**

**1. Replace the Current State Snapshot with:**

```
[AI writes the new snapshot here — copy-paste it directly]
```

**2. Add this new Session Log entry at the TOP of the Session Log:**

```markdown
### Session [N] — [DATE]

**Implemented:**

- [bullet list]

**Key decisions:**

- [bullet list]

**Files created/modified:**

- [file paths]

**Blockers / open questions:**

- [any open items, or "None"]

**🔜 Next steps for AI:**

1. [first task]
2. [second task]
```

---

> Copy both blocks into your PROJECT_CONTEXT.md, save the file, and paste it at the start of your next session.
