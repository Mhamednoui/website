# Digital Exam Preparation Platform — Full Project Blueprint

---

## 1. Technology Stack (and why)

### Frontend
| Layer | Technology | Reason |
|---|---|---|
| Framework | **Next.js 14 (React)** | Server-side rendering, routing, API routes, SEO, fast |
| Styling | **Tailwind CSS** | Rapid, consistent UI without writing custom CSS |
| State management | **Zustand** | Lightweight, simple — no Redux boilerplate |
| Video player | **Video.js + HLS.js** | Supports HLS streaming, DRM, custom controls |
| Forms | **React Hook Form + Zod** | Validation, type-safe, performant |
| Charts / progress | **Recharts** | Clean, React-native charts for dashboards |

### Mobile
| Layer | Technology | Reason |
|---|---|---|
| Framework | **React Native (Expo)** | Code sharing with web, iOS + Android from one codebase |
| Navigation | **Expo Router** | File-based routing (same pattern as Next.js) |
| Push notifications | **Expo Notifications** | Cross-platform, easy quota alerts |

### Backend
| Layer | Technology | Reason |
|---|---|---|
| Runtime | **Node.js** | JavaScript everywhere, huge ecosystem |
| Framework | **Express.js** | Lightweight, flexible REST API |
| ORM | **Prisma** | Type-safe database queries, easy migrations |
| Authentication | **JWT + bcrypt** | Stateless auth, secure password hashing |
| Validation | **Zod** | Consistent validation on backend too |
| Task queue | **Bull (Redis)** | Background jobs: expiry checks, email sends |

### Database & Storage
| Service | Use |
|---|---|
| **PostgreSQL** | All relational data: users, subscriptions, scores, QCM content |
| **Redis** | Session cache, click counter cache, job queues |
| **AWS S3** | Video files, course images, QCM images |
| **AWS CloudFront** | CDN delivery of all media (fast, global, secure) |

### Payments
- **Stripe** — primary: cards, subscriptions, webhooks
- **PayPal** — secondary option (many users in North Africa prefer PayPal)

### Infrastructure & DevOps
| Service | Use |
|---|---|
| **AWS EC2 or Railway.app** | Backend hosting (Railway is simpler to start) |
| **Vercel** | Frontend hosting (free tier, zero config for Next.js) |
| **Docker** | Containerize backend for consistent environments |
| **GitHub Actions** | CI/CD: test and deploy on every push |
| **Sentry** | Error tracking and performance monitoring |
| **Resend or SendGrid** | Transactional emails (alerts, receipts) |

---

## 2. Database Schema (key tables)

```
users
  id, email, password_hash, full_name, phone, avatar_url
  role (candidate | admin)
  created_at, updated_at

subscriptions
  id, user_id → users
  plan_type (monthly_3 | click_1000)
  starts_at, expires_at
  clicks_remaining (starts at 1000)
  status (active | expired | cancelled)
  stripe_subscription_id

payments
  id, user_id, subscription_id
  amount, currency, provider (stripe | paypal)
  status, created_at

license_categories
  id, name (e.g. "Category B", "Category C"), description

courses
  id, title, description, license_category_id
  order_index, is_published, thumbnail_url, created_at

course_lessons
  id, course_id, title, content_type (text | video | pdf)
  content_url, order_index, duration_seconds

videos
  id, title, category_id, description
  hls_url, thumbnail_url, is_published
  requires_subscription (bool)

video_danger_events
  id, video_id, user_id, timestamp_seconds, created_at

qcm_exams
  id, title, license_category_id, time_limit_seconds
  is_published, created_at

qcm_questions
  id, exam_id, question_text, image_url, order_index

qcm_choices
  id, question_id, choice_text, is_correct

exam_attempts
  id, user_id, exam_id
  started_at, submitted_at
  score, total_questions, correct_count
  feedback_json

click_logs
  id, user_id, subscription_id, question_id
  created_at
  (one row per QCM click — for audit trail)

notifications
  id, user_id, type (quota_80 | quota_95 | quota_100 | sub_expiring)
  is_read, sent_at
```

---

## 3. System Workflow

### Subscription Logic (the most complex part)
A user has ONE active subscription at a time. Two plan types:

**Type A — Time-based:** 3 calendar months from purchase date.
Access expires when `now() > expires_at`. No click limit.

**Type B — Click-based:** 1,000 QCM question clicks.
Each time a user loads a QCM question (not each answer — each question view), the system:
1. Decrements `clicks_remaining` on the subscription
2. Inserts a row in `click_logs`
3. Checks thresholds: if remaining hits 200 (80%), 50 (95%), or 0 (100%), sends a notification
4. If `clicks_remaining = 0`, blocks further QCM access

**Hybrid:** A subscription expires when EITHER condition is met first (whichever comes first — time OR clicks).

### QCM Click Counting
- A "click" = loading a question for the first time in an attempt
- Reviewing an answer (after submission) does NOT consume clicks
- If an attempt is abandoned mid-way, clicks already consumed are NOT refunded
- Admin can manually top-up clicks (admin panel action)

### Video Protection
- Videos are stored in S3 with private ACL (no public URL)
- Backend generates a **signed URL** (expires in 2 hours) per request
- The signed URL is given to the player — it streams directly from CloudFront
- URLs cannot be shared because they expire and are IP-locked (optional)
- HLS segmented streaming: even if someone captures a URL, they only get a 6-second chunk

---

## 4. Full Day-by-Day Build Plan

> **Reading this as a beginner:** Each day has a goal, exact steps, and what "done" looks like. Do not skip days — each builds on the previous. Estimated time: 8 productive hours per day.

---

### WEEK 1 — Setup & Foundation

---

#### Day 1 — Development environment and project scaffolding

**Goal:** Have a working codebase structure on your computer connected to GitHub.

**Steps:**
1. Install required tools (if not already installed):
   - Node.js v20+ → https://nodejs.org
   - Git → https://git-scm.com
   - VS Code → https://code.visualstudio.com
   - Docker Desktop → https://www.docker.com/products/docker-desktop
   - Postman (for API testing) → https://www.postman.com

2. Create project folder structure:
```
project-root/
  frontend/        ← Next.js app
  backend/         ← Express API
  mobile/          ← React Native (Expo)
  docs/            ← your notes and diagrams
```

3. Initialize the frontend:
```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --eslint --app
npm install zustand react-hook-form zod recharts axios
```

4. Initialize the backend:
```bash
cd backend
npm init -y
npm install express cors helmet dotenv bcryptjs jsonwebtoken prisma @prisma/client zod
npm install --save-dev typescript ts-node nodemon @types/express @types/node
npx prisma init
```

5. Initialize mobile:
```bash
cd mobile
npx create-expo-app . --template
npx expo install expo-router expo-notifications expo-secure-store
```

6. Create a GitHub repository:
   - Go to github.com → New repository → name it `exam-platform`
   - Follow the commands to push your code

7. Create a `.env` file in backend with placeholder values:
```
DATABASE_URL=postgresql://user:password@localhost:5432/examplatform
JWT_SECRET=change_this_to_a_random_64_char_string
REDIS_URL=redis://localhost:6379
STRIPE_SECRET_KEY=sk_test_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_BUCKET_NAME=...
AWS_CLOUDFRONT_URL=...
```

**Done when:** All three apps start without errors. GitHub has your first commit.

---

#### Day 2 — Database setup and schema

**Goal:** PostgreSQL running locally with all tables created.

**Steps:**
1. Start PostgreSQL with Docker:
```bash
docker run --name exam-db -e POSTGRES_PASSWORD=localpass -e POSTGRES_DB=examplatform -p 5432:5432 -d postgres:15
```

2. Start Redis with Docker:
```bash
docker run --name exam-redis -p 6379:6379 -d redis:alpine
```

3. Write the full Prisma schema in `backend/prisma/schema.prisma`:
   Copy the full schema from Section 2 of this document, translate it to Prisma model syntax. Example:
```prisma
model User {
  id            String        @id @default(cuid())
  email         String        @unique
  passwordHash  String
  fullName      String
  role          Role          @default(CANDIDATE)
  createdAt     DateTime      @default(now())
  subscriptions Subscription[]
  attempts      ExamAttempt[]
}

enum Role {
  CANDIDATE
  ADMIN
}
```
   Write all models for every table in Section 2.

4. Run migration:
```bash
cd backend
npx prisma migrate dev --name init
npx prisma studio
```
   Prisma Studio opens in browser — you should see all empty tables.

5. Create a seed file `backend/prisma/seed.ts` with:
   - 1 admin user (email: admin@platform.com, password: Admin123!)
   - 2 license categories (Category B, Category C)
   - 3 sample QCM questions

6. Run seed:
```bash
npx prisma db seed
```

**Done when:** Prisma Studio shows your seed data in the tables.

---

#### Day 3 — Authentication API (backend)

**Goal:** Register, login, and token refresh endpoints working and tested in Postman.

**Steps:**
1. Create backend file structure:
```
backend/src/
  routes/
    auth.routes.ts
    users.routes.ts
  controllers/
    auth.controller.ts
  middleware/
    auth.middleware.ts
    validate.middleware.ts
  services/
    auth.service.ts
  utils/
    token.ts
    password.ts
  app.ts
  server.ts
```

2. In `token.ts`, write two functions:
   - `generateAccessToken(userId, role)` → signs a JWT with 15-minute expiry
   - `generateRefreshToken(userId)` → signs a JWT with 30-day expiry

3. In `auth.service.ts`, write:
   - `register(email, password, fullName)` → check email not taken → hash password → create user → return tokens
   - `login(email, password)` → find user → compare hash → return tokens
   - `refreshTokens(refreshToken)` → verify token → issue new pair

4. In `auth.controller.ts`, write Express handler functions that call the service.

5. In `auth.middleware.ts`, write `requireAuth` middleware:
   - Extract `Authorization: Bearer <token>` header
   - Verify the JWT
   - Attach `req.user = { id, role }` to the request
   - Call `next()` or return 401

6. In `auth.routes.ts`:
```typescript
router.post('/register', validate(registerSchema), authController.register)
router.post('/login', validate(loginSchema), authController.login)
router.post('/refresh', authController.refresh)
router.post('/logout', requireAuth, authController.logout)
```

7. Test every endpoint in Postman:
   - POST /api/auth/register → should return access + refresh tokens
   - POST /api/auth/login → same
   - POST /api/auth/refresh → should return new tokens
   - Any route with a bad token → should get 401

**Done when:** All 4 endpoints pass Postman tests with correct status codes.

---

#### Day 4 — Authentication UI (frontend)

**Goal:** Login and register pages working, token stored in memory, redirect to dashboard.

**Steps:**
1. Create pages in Next.js App Router:
```
frontend/app/
  (auth)/
    login/page.tsx
    register/page.tsx
  (dashboard)/
    layout.tsx   ← protected layout
    dashboard/page.tsx
```

2. Create a Zustand auth store `frontend/stores/auth.store.ts`:
```typescript
interface AuthStore {
  user: User | null
  accessToken: string | null
  setAuth: (user, token) => void
  logout: () => void
}
```
   Store the access token in memory (Zustand state), NOT localStorage.
   Store the refresh token in an httpOnly cookie (set by the backend).

3. Create an axios instance `frontend/lib/api.ts`:
   - Base URL from environment variable
   - Interceptor: attach `Authorization: Bearer <token>` from store
   - Interceptor: on 401, call refresh endpoint, retry request

4. Build the Login page:
   - Form: email + password fields
   - On submit: call POST /api/auth/login
   - On success: call `setAuth()` in store, redirect to `/dashboard`
   - Show errors inline (wrong password, user not found)

5. Build the Register page:
   - Form: full name + email + password + confirm password
   - Client-side validation with Zod
   - On success: auto-login, redirect to `/dashboard`

6. Create the protected layout (`dashboard/layout.tsx`):
   - If no token in store, redirect to `/login`
   - Wrap children in a sidebar + topbar shell (minimal for now)

7. Create a simple `/dashboard` page that shows "Welcome, [name]"

**Done when:** You can register, log in, see the dashboard, and refreshing the page keeps you logged in (via the refresh token cookie).

---

#### Day 5 — Subscription system (backend)

**Goal:** API endpoints for creating a subscription after payment, tracking clicks, and checking access.

**Steps:**
1. Create `subscription.service.ts` with these functions:

```typescript
// Check if user has active subscription
getActiveSubscription(userId: string)
  → query DB for subscription where userId AND status='active'
    AND (expires_at > now() OR clicks_remaining > 0)

// Create subscription after payment
createSubscription(userId, planType, stripeData)
  → insert subscription row
  → if planType = 'monthly_3': set expires_at = now() + 3 months, clicks_remaining = null
  → if planType = 'click_1000': set expires_at = far future, clicks_remaining = 1000

// Consume a click (call this every time a QCM question is loaded)
consumeClick(userId: string, questionId: string)
  → get active subscription
  → if no subscription or clicks_remaining == 0: throw AccessDeniedError
  → decrement clicks_remaining by 1
  → insert row in click_logs
  → check thresholds: if remaining == 200, 50, or 0 → queue notification
  → return updated subscription

// Check access (middleware helper)
hasAccess(userId: string): boolean
  → return true if active subscription exists and has clicks or time remaining
```

2. Create a background job (using Bull) that runs every hour:
   - Find subscriptions where `expires_at < now()` and status = 'active'
   - Set status = 'expired'
   - Send expiry email to user

3. Create REST routes:
```
GET  /api/subscriptions/me          → return user's active subscription
POST /api/subscriptions/check-access → returns { hasAccess: bool, clicksRemaining: int }
POST /api/qcm/click                 → consumeClick, returns updated clicksRemaining
```

4. Write a middleware `requireSubscription` that:
   - Calls `hasAccess(req.user.id)`
   - Returns 403 with a clear message if no access

**Done when:** You can call the check-access endpoint and get back correct data. Clicking 3 times reduces the counter by 3 in the DB.

---

### WEEK 2 — Core Modules

---

#### Day 6 — Payment integration (Stripe)

**Goal:** User can pay for a subscription and it activates automatically.

**Steps:**
1. Create a Stripe account at stripe.com → get test keys.

2. Install Stripe:
```bash
cd backend && npm install stripe
```

3. Create `payment.service.ts`:

```typescript
// Create a Stripe Checkout session
createCheckoutSession(userId, planType)
  → create a Stripe Price object for the plan
  → create Checkout Session with:
      success_url: /dashboard?payment=success
      cancel_url: /pricing
      metadata: { userId, planType }
  → return { url } — redirect user to this URL

// Handle Stripe webhook (called by Stripe after payment)
handleWebhook(event)
  → if event.type == 'checkout.session.completed':
      read userId and planType from metadata
      call createSubscription(userId, planType, stripeData)
      send confirmation email
```

4. Create webhook endpoint:
```typescript
// IMPORTANT: raw body needed for webhook signature verification
app.post('/api/payments/webhook', express.raw({type: 'application/json'}), handleWebhook)
```

5. Register webhook in Stripe Dashboard:
   - Stripe Dashboard → Developers → Webhooks → Add endpoint
   - URL: `https://your-backend/api/payments/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`

6. For local testing, install Stripe CLI:
```bash
stripe listen --forward-to localhost:3001/api/payments/webhook
```

7. Frontend: create `/pricing` page with two plan cards:
   - "3 months" plan — show price
   - "1,000 clicks" plan — show price
   - Each button calls `POST /api/payments/checkout` → gets URL → `window.location.href = url`

8. After payment, on the success page: poll `GET /api/subscriptions/me` until it shows active.

**Done when:** You can complete a test payment (use Stripe test card 4242 4242 4242 4242) and your DB shows an active subscription.

---

#### Day 7 — Course system (backend + frontend)

**Goal:** Admin can create courses and lessons; candidates can browse and read them.

**Steps:**
1. Backend routes:
```
GET  /api/courses                     → list all published courses (public)
GET  /api/courses/:id                 → course detail + lessons list
GET  /api/courses/:id/lessons/:lessonId → lesson content (auth required)
POST /api/admin/courses               → create course (admin only)
PUT  /api/admin/courses/:id           → update course
POST /api/admin/courses/:id/lessons   → add lesson
DELETE /api/admin/courses/:id         → delete
```

2. Frontend pages:
```
/courses                 → grid of course cards by category
/courses/[id]            → course overview, lesson list
/courses/[id]/[lessonId] → lesson reader
```

3. Course card component:
   - Thumbnail image
   - Title, description snippet
   - License category badge
   - "Start learning" button (links to first lesson)

4. Lesson reader page:
   - Sidebar with lesson list (checkboxes for completed)
   - Main content area: render HTML content or embed PDF viewer
   - "Next lesson" button at bottom
   - Mark lesson as complete on load (insert in `user_lesson_progress` table — add this table to schema)

5. Add a simple rich-text editor (use `react-quill` or `tiptap`) in the admin panel for lesson content.

**Done when:** Admin can create a course with 3 lessons. Candidate can navigate through all 3.

---

#### Day 8 — Video platform (backend + frontend)

**Goal:** Secure video browsing, streaming, and the "detect danger" button.

**Steps:**
1. Backend: Video signed URL generation:
```typescript
// Generate a CloudFront signed URL (expires in 2 hours)
getSignedVideoUrl(videoId: string, userId: string)
  → check user has active subscription
  → get video record from DB
  → generate CloudFront signed URL using your private key
  → return { signedUrl, expiresAt }
```

   To generate CloudFront signed URLs, you need:
   - A CloudFront key pair (create in AWS IAM)
   - Use `@aws-sdk/cloudfront-signer` npm package

2. S3 and CloudFront setup (do this once):
   - Create S3 bucket → disable public access
   - Create CloudFront distribution → origin = your S3 bucket
   - Enable "Restrict Bucket Access" → only CloudFront can access S3
   - Set up Origin Access Identity (OAI)
   - Upload a test video in HLS format (use `ffmpeg` to convert MP4 to HLS)

3. Backend routes:
```
GET  /api/videos                  → list published videos (with subscription check)
GET  /api/videos/:id              → video details
POST /api/videos/:id/stream-url   → returns signed URL (auth + subscription required)
POST /api/videos/:id/danger       → record danger button press { timestampSeconds }
GET  /api/admin/videos            → all videos
POST /api/admin/videos            → create video record (upload HLS files to S3 separately)
```

4. Frontend: Video list page `/videos`
   - Grid of video thumbnails by category
   - Clicking a video goes to `/videos/[id]`

5. Frontend: Video player page `/videos/[id]`
   - On page load, call `POST /api/videos/:id/stream-url` → get signed URL
   - Initialize Video.js player with the signed URL as HLS source:
```javascript
const player = videojs('my-video', {
  sources: [{ src: signedUrl, type: 'application/x-mpegURL' }]
})
```
   - Overlay: a red "⚠ Detect Danger" button
   - On click: call `POST /api/videos/:id/danger` with `{ timestampSeconds: player.currentTime() }`
   - Show a small confirmation: "Danger moment recorded at 1:23"

6. DRM Note: For high-security video protection, you can add Widevine DRM via Bitmovin or Mux later. For MVP, signed URLs + HLS are sufficient.

**Done when:** A logged-in subscriber can watch a video and click the danger button; admin sees the event in the DB.

---

#### Day 9 — QCM exam engine (backend)

**Goal:** Full exam lifecycle: start → answer questions → submit → get scored results.

**Steps:**
1. Backend routes:
```
GET  /api/exams                        → list available exams (auth required)
GET  /api/exams/:id                    → exam details (no questions yet)
POST /api/exams/:id/start              → create AttemptRecord, return shuffled questions
POST /api/exams/:id/submit             → score the attempt, return results
GET  /api/exams/attempts               → user's history
GET  /api/exams/attempts/:attemptId    → single attempt result detail
```

2. Start exam logic:
```typescript
startExam(examId, userId)
  → check active subscription
  → call consumeClick() for each question (or once per attempt depending on your business rule — clarify this)
  → shuffle questions and choices
  → create ExamAttempt row with status='in_progress'
  → return { attemptId, questions: [{id, text, imageUrl, choices: [{id, text}]}] }
  // NOTE: do NOT return which choice is_correct at this stage
```

3. Submit exam logic:
```typescript
submitExam(attemptId, answers: {questionId, choiceId}[])
  → load all questions for this attempt
  → for each answer: check if choiceId.is_correct
  → calculate score = correct / total * 100
  → generate feedback per question: { questionId, correct: bool, correctChoiceId, explanation }
  → update AttemptRecord: score, submitted_at, feedback_json
  → return { score, correctCount, totalCount, feedback }
```

4. Timer enforcement: The exam has a `time_limit_seconds`. The frontend counts down visually. The backend checks that `submitted_at - started_at <= time_limit_seconds + 30s` (grace period). If over time, auto-submit with whatever was answered.

5. Admin routes for managing exam content:
```
POST /api/admin/exams/:id/questions       → add question (with image upload to S3)
PUT  /api/admin/questions/:id             → edit question
POST /api/admin/questions/:id/choices     → add choice
DELETE /api/admin/questions/:id           → delete question
```

**Done when:** You can start an exam via Postman, submit answers, and get back a scored result with feedback.

---

#### Day 10 — QCM exam UI (frontend)

**Goal:** A complete exam-taking experience in the browser.

**Steps:**
1. Create page `/exams` — list of available exams as cards:
   - Exam title, category, number of questions, time limit
   - "Start exam" button

2. Create page `/exams/[id]/take` — the exam UI:
   - Layout: top bar with timer + question X of N + click counter
   - Main area: question text + optional image
   - 4 choice buttons (A, B, C, D) — highlight selected in blue
   - "Next" and "Previous" navigation buttons
   - "Submit exam" button (appears on last question or always)

3. Timer implementation:
```typescript
const [timeLeft, setTimeLeft] = useState(examTimeLimit)
useEffect(() => {
  const interval = setInterval(() => {
    setTimeLeft(t => {
      if (t <= 1) { submitExam(); return 0; }  // auto-submit
      return t - 1;
    })
  }, 1000)
  return () => clearInterval(interval)
}, [])
```

4. Answer tracking: store answers in Zustand:
```typescript
{ questionId: string, choiceId: string }[]
```
   Update on each choice click. Allow changing answers before submit.

5. On submit: call `POST /api/exams/:id/submit` with all answers → redirect to `/exams/attempts/[attemptId]/results`

6. Results page `/exams/attempts/[id]/results`:
   - Score percentage (big number, colored: green ≥70%, orange 50-69%, red <50%)
   - Progress bar
   - "Review answers" section: each question with:
     - Your answer (green if correct, red if wrong)
     - The correct answer highlighted
     - Explanation text (if provided)

7. Click counter widget (visible during exam):
   - Show `clicks remaining: 847 / 1000`
   - Turn orange at 200 remaining, red at 50

**Done when:** You can take a full exam, submit it, and see a detailed results page.

---

### WEEK 3 — Admin Panel, Notifications, Polish

---

#### Day 11 — Admin panel (backend + frontend)

**Goal:** Admin can manage users, content, and view stats.

**Steps:**
1. All admin routes require `requireAuth` + `requireRole('ADMIN')` middleware.

2. Admin API routes:
```
GET  /api/admin/users                  → list users (with pagination + search)
GET  /api/admin/users/:id              → user detail + subscription + attempts
PUT  /api/admin/users/:id/subscription → manually adjust clicks or extend subscription
GET  /api/admin/stats                  → global stats dashboard data
GET  /api/admin/subscriptions          → all subscriptions with status
GET  /api/admin/notifications/config   → notification threshold settings (80%, 95%, 100%)
```

3. Admin frontend at `/admin/*`:
   - `/admin/users` — searchable table: name, email, subscription status, clicks, actions
   - `/admin/users/[id]` — user profile, subscription management, exam history
   - `/admin/courses` — list/create/edit courses and lessons
   - `/admin/videos` — list/publish/unpublish videos
   - `/admin/exams` — list/create exams + add questions
   - `/admin/stats` — dashboard with:
     - Total registered users
     - Active subscriptions
     - Revenue (from Stripe API)
     - Exams taken this week
     - Average score by category

4. Stats chart examples using Recharts:
   - LineChart: new registrations per day (last 30 days)
   - BarChart: exams per license category
   - PieChart: subscription type breakdown

5. Protect admin routes with Next.js middleware:
```typescript
// middleware.ts
if (pathname.startsWith('/admin') && user.role !== 'ADMIN') {
  redirect('/dashboard')
}
```

**Done when:** Admin can log in, browse users, view stats charts, and manage content.

---

#### Day 12 — Notification system

**Goal:** Users receive email and in-app notifications at click thresholds and subscription expiry.

**Steps:**
1. Set up email sending with Resend (resend.com — free tier: 3,000 emails/month):
```bash
npm install resend
```

2. Create email templates (HTML emails) for:
   - Welcome (after registration)
   - Payment confirmation
   - 80% clicks used: "You've used 800 of your 1,000 exam clicks"
   - 95% clicks used: "Only 50 clicks remaining!"
   - 100% clicks used: "You've reached your limit — renew your subscription"
   - Subscription expiring in 7 days

3. In `subscription.service.ts` → `consumeClick()`, after decrementing:
```typescript
const remaining = subscription.clicksRemaining - 1
const total = 1000
const percent = ((total - remaining) / total) * 100

if (percent >= 80 && !alreadyNotified('quota_80', userId)) {
  await sendEmail(userId, 'quota_80')
  await createNotification(userId, 'quota_80')
}
// repeat for 95% and 100%
```

4. In-app notification bell (frontend):
   - Topbar icon with unread count badge
   - Dropdown list of notifications
   - Click to mark as read → `PUT /api/notifications/:id/read`

5. Push notifications for mobile:
   - Store Expo push token in DB when user logs in on mobile
   - Use Expo's push notification API from backend:
```typescript
await fetch('https://exp.host/--/api/v2/push/send', {
  method: 'POST',
  body: JSON.stringify({
    to: user.expoPushToken,
    title: 'Exam clicks running low',
    body: 'You have 50 clicks remaining'
  })
})
```

**Done when:** Complete a test that triggers the 80% threshold → email arrives + notification appears in UI.

---

#### Day 13 — Mobile app (core screens)

**Goal:** Mobile app with login, course browsing, video player, and QCM exams.

**Steps:**
1. Share API service between web and mobile — create a shared `api.ts` that works in both:
   - Use axios in both (React Native supports it)
   - Configure base URL from environment

2. Build these screens in React Native:
   - `(auth)/login.tsx` — same logic as web login
   - `(auth)/register.tsx`
   - `(tabs)/index.tsx` — home: welcome message + stats (score average, clicks left)
   - `(tabs)/courses.tsx` — course list
   - `(tabs)/videos.tsx` — video list
   - `(tabs)/exams.tsx` — exam list
   - `profile.tsx` — user profile + subscription status

3. Video player in mobile:
   - Use `expo-av` or `react-native-video` for HLS playback
   - Same signed URL logic — request from backend, play in native player

4. QCM exam screen:
   - Same logic as web but adapted for mobile gestures:
   - Swipe left/right to navigate questions (or use buttons)
   - Timer at top
   - Larger tap targets for choices

5. Click counter:
   - Display on exam screen
   - Store in Zustand (synced from backend on app load)

6. Push notification setup:
```typescript
// On app load, after login:
const { status } = await Notifications.requestPermissionsAsync()
if (status === 'granted') {
  const token = await Notifications.getExpoPushTokenAsync()
  await api.post('/api/users/push-token', { token: token.data })
}
```

**Done when:** You can log in on the mobile app, browse courses, watch a video, and take a QCM exam.

---

#### Day 14 — Security hardening and performance

**Goal:** Platform is secure and fast before going to production.

**Steps:**
1. Backend security checklist:
   - [ ] Add `helmet()` middleware (sets security HTTP headers)
   - [ ] Add `express-rate-limit` on auth routes (max 10 requests per 15 minutes)
   - [ ] Add `cors()` with explicit allowed origins list
   - [ ] Validate ALL request bodies with Zod (no unvalidated input reaches DB)
   - [ ] Check Prisma queries never expose password hashes in responses
   - [ ] Add request logging with Morgan
   - [ ] Sanitize rich-text HTML with `DOMPurify` before storing

2. Frontend security:
   - [ ] Never store JWT access token in localStorage (keep in memory / Zustand only)
   - [ ] Use httpOnly cookie for refresh token
   - [ ] Add Content Security Policy header in `next.config.js`
   - [ ] Ensure all API error messages are generic (no stack traces to user)

3. Performance:
   - [ ] Add Redis caching for `GET /api/courses` (cache for 5 minutes)
   - [ ] Paginate all list endpoints (add `?page=1&limit=20` parameters)
   - [ ] Add Next.js Image component for all images (automatic optimization)
   - [ ] Lazy-load heavy components (video player, rich text editor) with `dynamic(() => import(...))`

4. QCM image optimization:
   - Resize images to max 800×600 before uploading to S3
   - Serve from CloudFront with cache-control headers

5. Set up Sentry in both frontend and backend:
```bash
npm install @sentry/nextjs  # frontend
npm install @sentry/node    # backend
```

**Done when:** Security checklist is all green. Page load times are under 2 seconds on a slow connection.

---

### WEEK 4 — Deployment

---

#### Day 15 — Cloud infrastructure setup

**Goal:** All cloud services configured and ready to accept your app.

**Steps:**
1. AWS setup:
   - Create AWS account (or use existing)
   - Create S3 bucket for media:
     - Block all public access
     - Enable versioning
   - Create CloudFront distribution pointing to S3
   - Create IAM user for your backend with S3 + CloudFront permissions only
   - Create CloudFront key pair for signed URLs

2. Database in production:
   - Option A (simpler): Use **Railway.app** → add a PostgreSQL service
   - Option B (more control): AWS RDS PostgreSQL instance (t3.micro for start)
   - Get the production `DATABASE_URL` connection string

3. Redis in production:
   - Option A: Railway.app → add a Redis service
   - Option B: AWS ElastiCache (more complex)

4. Backend hosting:
   - Deploy to **Railway.app** (simplest) or AWS EC2
   - Railway: connect your GitHub repo → set environment variables → deploy automatically

5. Frontend hosting:
   - Push frontend to Vercel: `npx vercel --prod`
   - Set environment variables in Vercel dashboard:
     - `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`

6. Domain setup:
   - Buy domain (e.g. on Namecheap or GoDaddy)
   - Point it to Vercel (frontend) with a CNAME record
   - Set up subdomain `api.yourdomain.com` pointing to your backend

7. SSL: Vercel and Railway provide SSL automatically. ✓

**Done when:** Your backend URL is live and returns JSON. Your frontend URL loads the app.

---

#### Day 16 — CI/CD pipeline and final deployment

**Goal:** Every push to `main` automatically tests and deploys the app.

**Steps:**
1. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd backend && npm ci && npm test
      - run: cd frontend && npm ci && npm run build
  
  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

2. Add all production environment variables as GitHub Secrets:
   - `RAILWAY_TOKEN`
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - etc.

3. Run production database migrations:
```bash
DATABASE_URL=<prod_url> npx prisma migrate deploy
```

4. Seed production with admin user:
```bash
DATABASE_URL=<prod_url> npx prisma db seed
```

5. Test all critical paths in production:
   - [ ] Register a new user
   - [ ] Log in
   - [ ] Pay for a subscription (use Stripe test mode first, then go live)
   - [ ] Watch a video
   - [ ] Take a full QCM exam
   - [ ] Submit exam → see results
   - [ ] Check that click counter decrements correctly
   - [ ] Log in as admin → view stats

6. Switch Stripe to live mode:
   - Replace `sk_test_` keys with `sk_live_` keys in production environment
   - Update webhook endpoint in Stripe dashboard to production URL

7. Set up uptime monitoring:
   - Sign up at UptimeRobot (free) → monitor your API and frontend URLs
   - Get email alerts if they go down

**Done when:** A push to `main` automatically deploys. All critical paths pass in production.

---

## 5. Project File Reference

### Key backend files to create
```
backend/src/
  routes/           auth, users, courses, videos, exams, subscriptions, payments, admin, notifications
  controllers/      one per route file
  services/         auth, subscription, payment, media, notification, exam
  middleware/       requireAuth, requireRole, requireSubscription, validate, errorHandler
  jobs/             expireSubscriptions.job.ts, sendAlerts.job.ts
  utils/            token.ts, password.ts, s3.ts, cloudfront.ts, email.ts
  prisma/           schema.prisma, seed.ts, migrations/
```

### Key frontend pages
```
frontend/app/
  (auth)/login, register
  (dashboard)/
    dashboard/       overview, stats
    courses/[id]/[lessonId]
    videos/[id]
    exams/[id]/take, attempts/[id]/results
    profile/
    notifications/
    pricing/
  (admin)/
    users/, videos/, courses/, exams/, stats/
  api/              any Next.js API routes if needed
```

---

## 6. Estimated Timeline Summary

| Phase | Days | Output |
|---|---|---|
| Setup & Foundation | Days 1–5 | Project runs locally, auth works, DB created, subscriptions track |
| Core Modules | Days 6–10 | Payments, courses, videos, full QCM exam engine |
| Admin & Notifications | Days 11–13 | Admin panel, email alerts, mobile app |
| Security & Deploy | Days 14–16 | Hardened, CI/CD, live in production |

**Total: ~16 focused workdays.** With part-time work, expect 6–8 weeks.

---

## 7. Cost Estimate (Monthly, after launch)

| Service | Free tier | Paid (after growth) |
|---|---|---|
| Vercel (frontend) | Free | $20/month (Pro) |
| Railway (backend + DB) | $5/month | $20–50/month |
| AWS S3 + CloudFront | ~$0 for small traffic | ~$10–30/month |
| Stripe | 2.9% + $0.30 per transaction | same |
| Resend (email) | 3,000/month free | $20/month |
| Sentry | Free | $26/month |
| **Total** | **~$5–10/month** | **~$100–150/month** |

---

## 8. Glossary (for beginners)

| Term | What it means here |
|---|---|
| **JWT** | A token (like a ticket) the server gives you after login. You show it on every request to prove who you are. |
| **Prisma** | A tool that lets you write database queries in TypeScript instead of raw SQL. |
| **HLS** | A video format that splits the video into small chunks. Makes streaming fast and scrubbing easy. |
| **Signed URL** | A temporary link to a private file. It expires after 2 hours so it can't be shared. |
| **Webhook** | Stripe calls your server automatically when a payment succeeds. You don't have to ask Stripe "did they pay?" — Stripe tells you. |
| **CDN** | A network of servers around the world. When a user requests a video, it comes from the nearest server, not your one server in one city. |
| **Seed** | Pre-filling the database with starter data so you can test without manually creating everything. |
| **Migration** | A tracked change to the database structure (e.g. "add a column"). Prisma manages these automatically. |
