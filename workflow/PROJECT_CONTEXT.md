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

**Last updated:** [DATE]
**Overall progress:** [e.g., 20% / Week 1 of 4]

[Write 3–6 sentences describing exactly where the project stands. Be specific. Example below:]

> Local dev environment is fully set up on Windows. Docker is running PostgreSQL and Redis. Backend scaffolding is complete (Express + TypeScript + Prisma initialized). The Prisma schema has been written with all 12 tables and the first migration has been applied. Auth endpoints (register, login, refresh, logout) are implemented and tested in Postman. Frontend Next.js app is scaffolded with Tailwind. The login page UI is built but not yet wired to the API. Next task is wiring the login form to the backend and setting up the Zustand auth store.

---

# Session Log

> Reverse chronological. Most recent session at the TOP. One entry per session.

---

### Session 3 — 2024-01-17

**Implemented:**

- Wrote all 12 Prisma models in `schema.prisma`
- Ran first migration: `npx prisma migrate dev --name init`
- Created seed file with 1 admin user, 2 license categories, 3 sample questions
- Auth service: `register()`, `login()`, `refreshTokens()`
- Auth controller and routes wired to Express app
- `requireAuth` JWT middleware implemented

**Key decisions:**

- Access token expires in 15 min, refresh token in 30 days
- Refresh token stored in httpOnly cookie (not localStorage)
- Used `cuid()` for all primary keys (safer than sequential integers for public APIs)

**Files created/modified:**

- `backend/prisma/schema.prisma` ← full schema
- `backend/prisma/seed.ts` ← created
- `backend/src/services/auth.service.ts` ← created
- `backend/src/controllers/auth.controller.ts` ← created
- `backend/src/routes/auth.routes.ts` ← created
- `backend/src/middleware/auth.middleware.ts` ← created
- `backend/src/app.ts` ← updated (auth routes mounted)

**Blockers / open questions:**

- ⚠️ Email sending not yet configured (Resend API key not obtained)
- ❓ Confirm with client: does abandoning an exam mid-way refund clicks?

**🔜 Next steps for AI:**

1. Build Zustand auth store in frontend (`src/stores/auth.store.ts`)
2. Build axios instance with token interceptor (`src/lib/api.ts`)
3. Wire login page form to `POST /api/auth/login`
4. Set up protected dashboard layout with redirect

---

### Session 2 — 2024-01-16

**Implemented:**

- Windows dev environment fully set up
- Docker running PostgreSQL + Redis via `docker-compose.yml`
- Backend: `npm init`, all packages installed, TypeScript configured
- Frontend: Next.js 14 scaffolded with Tailwind
- Mobile: Expo app initialized
- GitHub repo created, all code pushed

**Key decisions:**

- Using Docker only for DB/Redis, NOT for the app itself (simpler for beginner workflow)
- Using Railway.app for production hosting (simpler than raw AWS EC2)
- Mobile and web share the same Zustand store pattern and axios API client

**Files created/modified:**

- `docker-compose.yml` ← created
- `backend/src/app.ts`, `backend/src/server.ts` ← created
- `backend/.env` ← created (not on GitHub)
- `frontend/.env.local` ← created (not on GitHub)
- `backend/tsconfig.json`, `backend/package.json` ← configured

**Blockers / open questions:**

- None

**🔜 Next steps for AI:**

1. Write full Prisma schema (all 12 tables)
2. Run migration
3. Build auth service + controller + routes

---

### Session 1 — 2024-01-15

**Implemented:**

- Defined project requirements and scope
- Chose tech stack and architecture
- Created full day-by-day build plan (saved in docs/)

**Key decisions:**

- Next.js over plain React: SSR, routing, API routes all in one
- PostgreSQL over MongoDB: relational data (subscriptions, clicks, scores) fits SQL well
- Hybrid subscription: time OR clicks (whichever runs out first)

**Files created/modified:**

- `docs/platform-blueprint.md` ← full architecture reference
- `docs/workspace-setup-windows.md` ← dev environment guide

**Blockers / open questions:**

- ❓ Client needs to confirm: PayPal required or Stripe only?
- ❓ Video DRM level: signed URLs sufficient or full Widevine needed?

**🔜 Next steps for AI:**

1. Set up Windows dev environment (done in Session 2)

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
