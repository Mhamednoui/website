# Windows Workspace Setup — Complete Beginner Guide
### For the Exam Preparation Platform Project

> **How to read this guide:** Do every step in order. Do not skip anything. Every command is meant to be copy-pasted exactly. If something fails, read the error message and check the troubleshooting note below that step.

---

## The Short Answer: What You Need, What You Don't

| Tool | Need it? | Why |
|---|---|---|
| Node.js | ✅ Yes | Runs your JavaScript code (backend + frontend) |
| VS Code | ✅ Yes | The code editor you will live in |
| Git | ✅ Yes | Saves your code history, syncs to GitHub |
| Windows Terminal | ✅ Yes | A better command-line than the default |
| Docker | ✅ Yes, but only for the database | Runs PostgreSQL and Redis without installing them directly |
| Postman | ✅ Yes | Tests your API without needing a UI |
| Docker (for the app itself) | ❌ No | Too complex for a beginner at this stage |
| Linux / WSL | ❌ No | Not needed, everything works natively on Windows |
| nvm / multiple Node versions | ❌ No | Just install one Node version for now |

---

## Part 1 — Install Everything

### Step 1.1 — Windows Terminal (better command line)

Windows Terminal is a modern terminal that supports tabs and colors. You will use it constantly.

**Download:** https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701

Click "Get" → "Open in Store" → "Install". That's it.

After install, open it from the Start Menu. You should see a black window with a `>` cursor. This is where you type all commands in this guide.

---

### Step 1.2 — Git (code version control)

Git tracks every change you make to your code. It also lets you upload your code to GitHub.

**Download:** https://git-scm.com/download/win

- Run the installer
- On every screen, keep the default options selected
- The only exception: on the screen "Choosing the default editor", select **"Use Visual Studio Code as Git's default editor"** (you will install VS Code next)
- Click Next until it finishes

**Verify it worked** — open Windows Terminal and type:
```bash
git --version
```
You should see something like `git version 2.44.0`. If you see that, Git is installed. ✓

---

### Step 1.3 — Node.js (runs JavaScript on your computer)

Node.js is the engine that runs your backend server and builds your frontend.

**Download:** https://nodejs.org/en/download

- Click the **"Windows Installer (.msi)"** button under **LTS** (Long Term Support) — this is the stable version
- Run the installer, keep all defaults, click Next until done
- When asked "Tools for Native Modules" — check the box that says "Automatically install the necessary tools"

**Verify it worked:**
```bash
node --version
npm --version
```
You should see something like `v20.11.0` and `10.2.4`. Both must show a version number. ✓

> **What is npm?** npm comes bundled with Node.js. It is the tool you use to install packages (libraries of code other people wrote). You will use `npm install` constantly.

---

### Step 1.4 — VS Code (your code editor)

VS Code is where you write all your code.

**Download:** https://code.visualstudio.com/download

- Click "Windows" (the big blue button)
- Run the installer
- On the "Select Additional Tasks" screen, check ALL the boxes (especially "Add to PATH" and "Open with Code")
- Click Next until done

**After install, open VS Code and install these extensions:**

Click the Extensions icon on the left sidebar (looks like 4 squares), search for each name, and click Install:

| Extension name | What it does |
|---|---|
| `ESLint` | Highlights code errors as you type |
| `Prettier - Code formatter` | Auto-formats your code to look clean |
| `Prisma` | Highlights database schema files |
| `Tailwind CSS IntelliSense` | Autocompletes CSS class names |
| `GitLens` | Shows who changed what in your code |
| `REST Client` | Test API calls inside VS Code (alternative to Postman) |
| `Error Lens` | Shows errors inline next to the code line |
| `Auto Rename Tag` | Renames closing HTML tag when you rename the opening one |

**Configure Prettier as your auto-formatter:**
1. In VS Code, press `Ctrl + Shift + P`
2. Type `Preferences: Open User Settings (JSON)` and press Enter
3. Paste this inside the `{}`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "editor.wordWrap": "on"
}
```
4. Press `Ctrl + S` to save

Now every time you save a file, your code will be automatically formatted. ✓

---

### Step 1.5 — Docker Desktop (runs your database)

Docker runs PostgreSQL (your database) and Redis (your cache) as isolated containers. This means you do NOT install PostgreSQL directly on Windows — Docker handles it. This is cleaner and easier to reset.

**Download:** https://www.docker.com/products/docker-desktop/

- Click "Download for Windows - AMD64"
- Run the installer
- Keep all defaults, click OK
- When asked to restart Windows — do it

**After restart, open Docker Desktop.** It will ask you to create a free account — do it, it's required. After logging in, you will see a dashboard. Leave it open in the background. Docker must be running whenever you work on this project.

**Verify it worked** (in Windows Terminal):
```bash
docker --version
docker compose version
```
Both must show version numbers. ✓

> **What is Docker doing here?** Instead of installing PostgreSQL (a complex database server) directly on Windows, Docker runs it in a "container" — like a mini isolated computer inside your computer. When you're done for the day, you just stop the container. When you come back, you start it again. Your data is saved.

---

### Step 1.6 — Postman (test your API)

Postman lets you send requests to your backend to test it, without needing a frontend.

**Download:** https://www.postman.com/downloads/

- Click "Download the App" → Windows 64-bit
- Run the installer
- Create a free account when prompted

You will use Postman starting on Day 3 of the project.

---

### Step 1.7 — GitHub account

GitHub is where your code lives online. It is free.

**Sign up:** https://github.com/signup

- Choose a username (this is public — keep it professional)
- Verify your email

**Connect Git to GitHub on your computer:**

Open Windows Terminal and run these two commands (replace with your real info):
```bash
git config --global user.name "Your Full Name"
git config --global user.email "your@email.com"
```

Then set up a personal access token so Git can talk to GitHub:
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name: `my-laptop`
4. Expiration: 90 days
5. Check the `repo` checkbox
6. Click "Generate token"
7. **Copy the token — you will NEVER see it again**

When Git asks for your password in the terminal, paste this token.

---

## Part 2 — Create Your Folder Structure

Open Windows Terminal. You are going to create your project in a folder. Run these commands one by one:

```bash
cd C:\
mkdir Projects
cd Projects
mkdir exam-platform
cd exam-platform
mkdir frontend
mkdir backend
mkdir mobile
mkdir docs
```

Now open this folder in VS Code:
```bash
code .
```

VS Code will open with your `exam-platform` folder in the left sidebar. This is your workspace.

> **From now on, always open your project this way:** open Windows Terminal, `cd C:\Projects\exam-platform`, then `code .`

Your folder structure should look like this:
```
C:\Projects\
  exam-platform\
    frontend\        ← Next.js website (what users see)
    backend\         ← Node.js API server (the brain)
    mobile\          ← React Native phone app
    docs\            ← your notes, diagrams, client requirements
```

---

## Part 3 — Set Up the Database with Docker

You are going to start PostgreSQL and Redis using Docker. You only do this setup once. After that, you start them with one command.

### Step 3.1 — Create the Docker Compose file

In VS Code, in the root of your `exam-platform` folder (NOT inside frontend or backend), create a new file called `docker-compose.yml`:

```
exam-platform\
  docker-compose.yml   ← create this file now
  frontend\
  backend\
  mobile\
  docs\
```

Paste this content into `docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: exam-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: examuser
      POSTGRES_PASSWORD: exampass123
      POSTGRES_DB: examplatform
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:alpine
    container_name: exam-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

Save the file with `Ctrl + S`.

### Step 3.2 — Start the database

In Windows Terminal (make sure you are in `C:\Projects\exam-platform`):
```bash
docker compose up -d
```

The first time, this will download PostgreSQL and Redis images (~200MB). Wait for it to finish.

**Verify both containers are running:**
```bash
docker compose ps
```

You should see two rows, both showing `running` in the Status column:
```
NAME              STATUS
exam-postgres     running
exam-redis        running
```

✓ Your database is now running on your computer.

### How to start and stop the database

**Every time you start working (morning):**
```bash
cd C:\Projects\exam-platform
docker compose up -d
```

**Every time you stop working (end of day):**
```bash
docker compose stop
```

**If you want to see the database logs:**
```bash
docker compose logs postgres
```

> **Your data is safe when you stop.** Docker saves the data in a "volume" on your hard drive. Stopping and starting containers does not delete your data.

---

## Part 4 — Set Up the Backend

### Step 4.1 — Initialize the Node.js project

Open Windows Terminal, go into the backend folder:
```bash
cd C:\Projects\exam-platform\backend
npm init -y
```

This creates a `package.json` file — the list of everything your backend needs.

### Step 4.2 — Install backend packages

Copy and paste this entire block (it is one command that installs many packages):
```bash
npm install express cors helmet dotenv bcryptjs jsonwebtoken prisma @prisma/client zod bull ioredis @aws-sdk/client-s3 @aws-sdk/cloudfront-signer stripe resend morgan
```

Then install developer tools (only used while building, not in production):
```bash
npm install --save-dev typescript ts-node-dev @types/express @types/node @types/bcryptjs @types/jsonwebtoken @types/morgan @types/cors nodemon
```

Wait for both to finish. You will see a `node_modules` folder appear — this is where all the packages live. **Never edit files inside `node_modules`.**

### Step 4.3 — Configure TypeScript

Still in the `backend` folder, run:
```bash
npx tsc --init
```

This creates a `tsconfig.json` file. Open it in VS Code and replace all the content with:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 4.4 — Initialize Prisma (database connection)

Still in the `backend` folder:
```bash
npx prisma init
```

This creates:
- `backend/prisma/schema.prisma` — where you define your database tables
- `backend/.env` — environment variables

### Step 4.5 — Create the .env file

Open `backend/.env` and replace its content with:
```env
# Database
DATABASE_URL="postgresql://examuser:exampass123@localhost:5432/examplatform"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secrets (change these to random strings before going live)
JWT_ACCESS_SECRET="dev_access_secret_change_in_production_minimum_32_chars"
JWT_REFRESH_SECRET="dev_refresh_secret_change_in_production_minimum_32_chars"

# App
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"

# Stripe (get from stripe.com - use test keys for now)
STRIPE_SECRET_KEY="sk_test_REPLACE_ME"
STRIPE_WEBHOOK_SECRET="whsec_REPLACE_ME"

# AWS S3 (fill in after creating AWS account)
AWS_ACCESS_KEY_ID="REPLACE_ME"
AWS_SECRET_ACCESS_KEY="REPLACE_ME"
AWS_REGION="eu-west-1"
AWS_BUCKET_NAME="exam-platform-media"
AWS_CLOUDFRONT_URL="https://REPLACE.cloudfront.net"

# Email (get from resend.com)
RESEND_API_KEY="re_REPLACE_ME"
```

> **Important:** This `.env` file contains secrets. It must NEVER be uploaded to GitHub. The next step creates a `.gitignore` that prevents this.

### Step 4.6 — Create .gitignore

In the `backend` folder, create a file called `.gitignore` with this content:
```
node_modules/
dist/
.env
*.log
```

### Step 4.7 — Create the backend folder structure

In Windows Terminal (still in the `backend` folder):
```bash
mkdir src
cd src
mkdir routes controllers services middleware utils jobs
```

Then create the main entry files. In VS Code, create these files:

**`backend/src/app.ts`:**
```typescript
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(morgan('dev'))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
```

**`backend/src/server.ts`:**
```typescript
import 'dotenv/config'
import app from './app'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})
```

### Step 4.8 — Add npm scripts

Open `backend/package.json` and find the `"scripts"` section. Replace it with:
```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "db:migrate": "prisma migrate dev",
  "db:studio": "prisma studio",
  "db:seed": "ts-node prisma/seed.ts"
}
```

### Step 4.9 — Test the backend

Make sure Docker is running (you should see the containers running). Then:
```bash
cd C:\Projects\exam-platform\backend
npm run dev
```

Open your browser and go to: http://localhost:3001/health

You should see:
```json
{ "status": "ok", "timestamp": "2024-..." }
```

Your backend is running. ✓

Press `Ctrl + C` in the terminal to stop it.

---

## Part 5 — Set Up the Frontend

### Step 5.1 — Create the Next.js app

Open a NEW Windows Terminal tab (`Ctrl + Shift + T` in Windows Terminal), go to the frontend folder:
```bash
cd C:\Projects\exam-platform\frontend
```

Run the Next.js installer:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

It will ask you questions — answer like this:
```
Would you like to use TypeScript? › Yes
Would you like to use ESLint? › Yes
Would you like to use Tailwind CSS? › Yes
Would you like to use `src/` directory? › Yes
Would you like to use App Router? › Yes
Would you like to customize the default import alias? › Yes (then press Enter for the default @/*)
```

Wait for it to finish installing.

### Step 5.2 — Install frontend packages
```bash
npm install zustand axios react-hook-form zod @hookform/resolvers recharts video.js hls.js
npm install --save-dev @types/video.js
```

### Step 5.3 — Create the frontend .env file

In the `frontend` folder, create `.env.local` (not `.env` — Next.js uses `.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Step 5.4 — Create frontend .gitignore addition

Open the existing `frontend/.gitignore` (Next.js already created one) and make sure `.env.local` is in it. It should already be there.

### Step 5.5 — Test the frontend

```bash
cd C:\Projects\exam-platform\frontend
npm run dev
```

Open your browser and go to: http://localhost:3000

You should see the default Next.js welcome page. ✓

Press `Ctrl + C` to stop it.

---

## Part 6 — Set Up the Mobile App

### Step 6.1 — Install Expo CLI globally

```bash
npm install -g expo-cli eas-cli
```

### Step 6.2 — Create the Expo app

```bash
cd C:\Projects\exam-platform\mobile
npx create-expo-app . --template blank-typescript
```

### Step 6.3 — Install mobile packages

```bash
npx expo install expo-router expo-notifications expo-secure-store expo-av @react-native-async-storage/async-storage
npm install axios zustand react-hook-form zod @hookform/resolvers
```

### Step 6.4 — Test the mobile app

```bash
cd C:\Projects\exam-platform\mobile
npx expo start
```

This opens a QR code in your terminal. To view the app on your phone:
1. Download **Expo Go** from the App Store or Google Play on your phone
2. Scan the QR code with your phone camera (iOS) or with the Expo Go app (Android)

The app will load on your phone. ✓

Press `Ctrl + C` to stop it.

---

## Part 7 — Connect Git and GitHub

### Step 7.1 — Initialize Git for the whole project

```bash
cd C:\Projects\exam-platform
git init
```

### Step 7.2 — Create the root .gitignore

In the root `exam-platform` folder, create `.gitignore`:
```
# Dependencies
node_modules/
.expo/

# Build outputs
.next/
dist/
build/

# Environment files — NEVER commit these
.env
.env.local
.env.production

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db

# Prisma
prisma/*.db
```

### Step 7.3 — Make your first commit

```bash
cd C:\Projects\exam-platform
git add .
git commit -m "Initial project setup"
```

### Step 7.4 — Push to GitHub

1. Go to https://github.com/new
2. Repository name: `exam-platform`
3. Keep it Private
4. Do NOT check "Add a README" (you already have files)
5. Click "Create repository"
6. GitHub shows you commands. Run these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/exam-platform.git
git branch -M main
git push -u origin main
```

Go to your GitHub repository page — you should see your files there. ✓

---

## Part 8 — Your Daily Work Routine

Every day when you start working, do this in order:

### 1. Start Docker (database)
```bash
cd C:\Projects\exam-platform
docker compose up -d
```

### 2. Start the backend (in Terminal tab 1)
```bash
cd C:\Projects\exam-platform\backend
npm run dev
```
Leave this running. The backend auto-reloads when you save files.

### 3. Start the frontend (in Terminal tab 2)
Open a new tab in Windows Terminal (`Ctrl + Shift + T`):
```bash
cd C:\Projects\exam-platform\frontend
npm run dev
```
Leave this running.

### 4. Open VS Code
```bash
cd C:\Projects\exam-platform
code .
```

### 5. Open your browser
- Frontend: http://localhost:3000
- Backend health check: http://localhost:3001/health
- Prisma database viewer: run `npm run db:studio` in the backend folder

### End of day
```bash
# Stop Docker database
cd C:\Projects\exam-platform
docker compose stop
```

---

## Part 9 — Final Folder Structure (complete picture)

After all setup, your project should look exactly like this:

```
C:\Projects\
  exam-platform\
    docker-compose.yml          ← starts PostgreSQL + Redis
    .gitignore                  ← tells Git what NOT to save
    
    backend\
      prisma\
        schema.prisma           ← database table definitions
        seed.ts                 ← starter data
        migrations\             ← auto-generated, don't edit
      src\
        routes\
          auth.routes.ts
          users.routes.ts
          courses.routes.ts
          videos.routes.ts
          exams.routes.ts
          subscriptions.routes.ts
          payments.routes.ts
          admin.routes.ts
          notifications.routes.ts
        controllers\
          auth.controller.ts
          courses.controller.ts
          videos.controller.ts
          exams.controller.ts
          subscriptions.controller.ts
          payments.controller.ts
          admin.controller.ts
        services\
          auth.service.ts
          subscription.service.ts
          payment.service.ts
          media.service.ts
          notification.service.ts
          exam.service.ts
        middleware\
          auth.middleware.ts        ← checks JWT token
          role.middleware.ts        ← checks if admin
          subscription.middleware.ts← checks active subscription
          validate.middleware.ts    ← validates request body
          error.middleware.ts       ← handles all errors
        jobs\
          expireSubscriptions.job.ts
          sendAlerts.job.ts
        utils\
          token.ts                  ← JWT create/verify
          password.ts               ← hash/compare passwords
          s3.ts                     ← upload files to AWS
          cloudfront.ts             ← generate signed video URLs
          email.ts                  ← send emails via Resend
        app.ts                      ← Express setup
        server.ts                   ← starts the server
      package.json
      tsconfig.json
      .env                          ← secrets (never on GitHub)
      .gitignore
    
    frontend\
      src\
        app\
          (auth)\
            login\
              page.tsx
            register\
              page.tsx
          (dashboard)\
            layout.tsx              ← protected: redirects if not logged in
            dashboard\
              page.tsx
            courses\
              page.tsx
              [id]\
                page.tsx
                [lessonId]\
                  page.tsx
            videos\
              page.tsx
              [id]\
                page.tsx
            exams\
              page.tsx
              [id]\
                take\
                  page.tsx
              attempts\
                [attemptId]\
                  page.tsx
            profile\
              page.tsx
            pricing\
              page.tsx
          (admin)\
            layout.tsx              ← admin only
            users\
              page.tsx
              [id]\
                page.tsx
            videos\
              page.tsx
            courses\
              page.tsx
            exams\
              page.tsx
            stats\
              page.tsx
        components\
          ui\                       ← reusable: Button, Input, Modal, Badge
          layout\                   ← Sidebar, Topbar, Footer
          courses\                  ← CourseCard, LessonList
          exams\                    ← QuestionCard, Timer, ClickCounter
          videos\                   ← VideoPlayer, DangerButton
          admin\                    ← UserTable, StatsChart
        stores\
          auth.store.ts             ← user login state
          subscription.store.ts     ← click counter, plan info
        lib\
          api.ts                    ← axios instance with token interceptor
          utils.ts                  ← helper functions
        hooks\
          useAuth.ts
          useSubscription.ts
        types\
          index.ts                  ← TypeScript type definitions
      public\                       ← images, icons, fonts
      .env.local                    ← secrets (never on GitHub)
      next.config.js
      tailwind.config.ts
      package.json
    
    mobile\
      app\
        (auth)\
          login.tsx
          register.tsx
        (tabs)\
          index.tsx               ← home screen
          courses.tsx
          videos.tsx
          exams.tsx
        profile.tsx
      components\
      stores\
        auth.store.ts
        subscription.store.ts
      lib\
        api.ts
      assets\
      package.json
      app.json
    
    docs\
      requirements.md             ← paste client requirements here
      decisions.md                ← note your decisions (why you chose X)
      api-endpoints.md            ← list all your API routes
```

---

## Part 10 — Quick Reference: Most Used Commands

### Backend
```bash
cd C:\Projects\exam-platform\backend

npm run dev              # start backend (auto-reloads on save)
npm run db:migrate       # apply database schema changes
npm run db:studio        # open database viewer in browser
npm run db:seed          # fill database with test data
```

### Frontend
```bash
cd C:\Projects\exam-platform\frontend

npm run dev              # start frontend (auto-reloads on save)
npm run build            # build for production (check for errors)
npm run lint             # check for code style errors
```

### Mobile
```bash
cd C:\Projects\exam-platform\mobile

npx expo start           # start mobile app (scan QR with your phone)
npx expo start --clear   # start fresh if something is broken
```

### Docker (database)
```bash
cd C:\Projects\exam-platform

docker compose up -d     # start database (background)
docker compose stop      # stop database (keeps your data)
docker compose down      # stop AND delete containers (keeps data in volumes)
docker compose down -v   # ⚠ DANGER: stop AND delete EVERYTHING including data
docker compose ps        # see what's running
docker compose logs postgres   # see database logs
```

### Git (save your work)
```bash
git status               # see what files you changed
git add .                # stage all changes
git commit -m "message"  # save a snapshot with a description
git push                 # upload to GitHub

# Good commit message examples:
git commit -m "Add login page"
git commit -m "Fix subscription click counter bug"
git commit -m "Add video player component"
```

---

## Part 11 — Troubleshooting Common Problems

### "npm is not recognized"
Node.js is not installed correctly. Go back to Step 1.3, download the installer again, and make sure to check "Add to PATH" during install. Then restart Windows Terminal.

### "docker is not recognized"
Docker Desktop is not installed or not running. Open Docker Desktop from the Start Menu and wait for it to show "Docker Desktop is running" in the system tray.

### "Cannot connect to database" when starting backend
Your Docker containers are not running. Run:
```bash
docker compose up -d
```
Then try starting the backend again.

### "Port 3001 is already in use"
Another process is using port 3001. Find and kill it:
```bash
netstat -ano | findstr :3001
taskkill /PID <the_number_shown> /F
```
Or just restart your computer.

### "Port 3000 is already in use"
Same issue for the frontend. Either kill the process or run the frontend on a different port:
```bash
npm run dev -- -p 3002
```

### "Module not found" error
You forgot to install a package. Read the error — it tells you the package name. Run:
```bash
npm install <package-name>
```

### My changes are not showing up
- Backend: make sure `npm run dev` is running. It auto-reloads on save.
- Frontend: make sure `npm run dev` is running. It auto-reloads on save.
- If still not working: stop and restart `npm run dev`.

### Git asks for username/password every time
Set up the Git credential manager:
```bash
git config --global credential.helper manager-core
```
Then push once — it will ask for your token, store it, and never ask again.

---

## Summary Checklist

Go through this before starting to code:

- [ ] Windows Terminal installed
- [ ] Git installed and configured (`git --version` works)
- [ ] Node.js installed (`node --version` and `npm --version` both work)
- [ ] VS Code installed with all 8 extensions
- [ ] Docker Desktop installed and running (`docker --version` works)
- [ ] Postman installed
- [ ] GitHub account created and connected
- [ ] `exam-platform` folder created at `C:\Projects\exam-platform`
- [ ] `docker-compose.yml` created and `docker compose up -d` runs successfully
- [ ] Backend folder initialized, packages installed, `npm run dev` shows health check
- [ ] Frontend folder initialized, `npm run dev` shows Next.js welcome page
- [ ] Mobile folder initialized, `npx expo start` shows QR code
- [ ] Everything pushed to GitHub

Once all boxes are checked, you are ready to start Day 1 of the build plan. ✓
