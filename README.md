# NexusID

A modern, full-stack identity and access management platform with AI-powered chat, built with SvelteKit 5, Better Auth, Drizzle ORM, and Tailwind CSS v4.

## Tech Stack

| Layer          | Technology                                                    |
| -------------- | ------------------------------------------------------------- |
| Framework      | [SvelteKit 2](https://kit.svelte.dev/) + Svelte 5            |
| Language       | TypeScript 5.9                                                |
| Styling        | [Tailwind CSS v4](https://tailwindcss.com/) (forms, typography plugins) |
| Auth           | [Better Auth](https://better-auth.com/) (email + GitHub + Google OAuth) |
| Database       | PostgreSQL via [Neon](https://neon.tech/) serverless driver   |
| ORM            | [Drizzle ORM](https://orm.drizzle.team/)                     |
| AI             | [Vercel AI SDK](https://sdk.vercel.ai/) + [Langchain](https://js.langchain.com/) + Google Gemini      |
| Email          | [Nodemailer](https://nodemailer.com/) (Gmail SMTP)           |
| Package Manager| pnpm (recommended) / npm / yarn                              |

## Features

- **Authentication** — Email/password with email verification, GitHub OAuth, Google OAuth
- **Password Reset** — Forgot password flow with email-based reset links
- **Role-Based Access** — Admin and user roles with middleware-level enforcement
- **Admin Dashboard** — User management (create, ban, suspend, delete), statistics, search/filter
- **AI Chat** — Streaming chat interface powered by Google Gemini via Vercel AI SDK
- **Persistent Memory** — Langchain-powered conversation memory with automatic context preservation
- **Conversation Management** — Create, retrieve, and manage multiple chat sessions per user
- **In-Context Learning** — AI remembers previous messages and maintains conversation history
- **Profile Management** — Update name, email, avatar, change password, delete account
- **Responsive UI** — Dark-mode-ready design with glass-morphism cards and gradient backgrounds

## Project Structure

```
NexusID/
├── src/
│   ├── routes/
│   │   ├── (app)/                 # Protected routes (auth required)
│   │   │   ├── admin/             # Admin dashboard (admin role only)
│   │   │   ├── chat/              # AI chat interface
│   │   │   └── profile/           # User profile settings
│   │   ├── (auth)/                # Public auth routes
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   └── verify-email/
│   │   ├── api/
│   │   │   ├── chat/              # Streaming chat API with Langchain memory
│   │   │   ├── chat/messages/     # Fetch conversation history
│   │   │   └── conversations/     # Conversation management endpoints
│   │   └── +layout.svelte         # Root layout
│   ├── lib/
│   │   ├── server/
│   │   │   ├── auth.ts            # Better Auth config (OAuth, email, plugins)
	│   │   │   ├── chat-service.ts    # Database operations for conversations & messages
	│   │   │   ├── langchain-chain.ts # Langchain chain setup with memory management
	│   │   │   └── db/
	│   │   │       ├── schema.ts      # Drizzle schema (users, conversations, messages)
│   │   │       ├── auth.schema.ts # Auto-generated Better Auth schema
│   │   │       └── index.ts       # Neon database client
│   │   ├── components/            # Shared Svelte components (Navbar, Chat)
│   │   └── auth-client.ts         # Better Auth browser client
│   ├── hooks.server.ts            # Auth middleware & route protection
│   └── app.d.ts                   # TypeScript declarations
├── drizzle/                       # Database migrations
├── .env.example                   # Environment variable template
├── drizzle.config.ts              # Drizzle ORM configuration
├── svelte.config.js               # SvelteKit adapter config
├── vite.config.ts                 # Vite + Tailwind plugin config
└── package.json
```

## Prerequisites

- **Node.js** >= 18.x ([download](https://nodejs.org/))
- **pnpm** (recommended) — `npm install -g pnpm`
- **PostgreSQL** database — [Neon](https://neon.tech/) free tier works out of the box
- **GitHub OAuth App** — for GitHub login ([create one](https://github.com/settings/developers))
- **Google OAuth Credentials** — for Google login ([Google Cloud Console](https://console.cloud.google.com/apis/credentials))
- **Gmail App Password** — for sending verification/reset emails ([generate here](https://myaccount.google.com/apppasswords))
- **Google AI API Key** — for AI chat ([Google AI Studio](https://aistudio.google.com/))

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/noumanusman-ai/Assignment2.git
cd NexusID
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Set up environment variables

Copy the example env file and fill in your credentials:

```bash
cp .env.example .env
```

Open `.env` and configure each variable:

```env
# ── Database ──────────────────────────────────────────────
# Neon PostgreSQL connection string
DATABASE_URL="postgres://user:password@host:port/db-name"

# ── App Origin ────────────────────────────────────────────
# Used by Better Auth for callbacks and CSRF validation
# Local development:
ORIGIN="http://localhost:5173"
# Production (replace with your actual domain):
# ORIGIN="https://your-app.vercel.app"

# ── Better Auth ───────────────────────────────────────────
# Generate a random secret: openssl rand -base64 32
BETTER_AUTH_SECRET="your-random-secret-here"

# ── GitHub OAuth ──────────────────────────────────────────
# Create at: https://github.com/settings/developers
# Set callback URL to: {ORIGIN}/api/auth/callback/github
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# ── Google OAuth ──────────────────────────────────────────
# Create at: https://console.cloud.google.com/apis/credentials
# Set authorized redirect URI to: {ORIGIN}/api/auth/callback/google
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# ── Email (Gmail SMTP) ───────────────────────────────────
# Your Gmail address
SMTP_USER="you@gmail.com"
# App password (NOT your Gmail password)
# Generate at: https://myaccount.google.com/apppasswords
SMTP_APP_PASSWORD=""

# ── AI Chat ──────────────────────────────────────────────
# Google Gemini API key from: https://aistudio.google.com/
GOOGLE_GENERATIVE_AI_API_KEY=""
```

### 4. Set up the database

Push the Drizzle schema to your PostgreSQL database:

```bash
pnpm db:push
# or
npm run db:push
```

Generate the Better Auth schema file:

```bash
pnpm auth:schema
# or
npm run auth:schema
```

This will create all tables including:
- `user` — User accounts with profiles
- `session` — Authentication sessions
- `account` — OAuth provider accounts
- `verification` — Email verification tokens
- `conversations` — Chat session metadata (NEW)
- `messages` — Chat message history with Langchain memory (NEW)

### 5. Start the development server

```bash
pnpm dev
# or
npm run dev
```

The app will be running at **http://localhost:5173**.

## Available Scripts

| Command              | Description                                       |
| -------------------- | ------------------------------------------------- |
| `pnpm dev`           | Start development server on port 5173             |
| `pnpm build`         | Create production build                           |
| `pnpm preview`       | Preview production build locally                  |
| `pnpm check`         | Run svelte-check + TypeScript validation          |
| `pnpm check:watch`   | Run svelte-check in watch mode                    |
| `pnpm lint`          | Check code formatting with Prettier               |
| `pnpm format`        | Auto-format all files with Prettier               |
| `pnpm db:push`       | Push Drizzle schema to the database               |
| `pnpm db:generate`   | Generate Drizzle migration files                  |
| `pnpm db:migrate`    | Run pending database migrations                   |
| `pnpm db:studio`     | Open Drizzle Studio (visual DB browser)           |
| `pnpm auth:schema`   | Regenerate Better Auth schema from auth config    |

## Database Schema

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    user       │     │   session    │     │   account    │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │◄────│ userId (FK)  │     │ userId (FK)  │──►│ user.id │
│ name         │     │ token        │     │ providerId   │
│ email        │     │ expiresAt    │     │ password     │
│ emailVerified│     │ ipAddress    │     │ accessToken  │
│ image        │     │ userAgent    │     │ refreshToken │
│ role         │     │ createdAt    │     │ createdAt    │
│ banned       │     │ updatedAt    │     │ updatedAt    │
│ bannedReason │     └──────────────┘     └──────────────┘
│ createdAt    │
│ updatedAt    │     ┌──────────────┐     ┌──────────────┐
└──────────────┘     │ verification │     │conversation  │
                     ├──────────────┤     ├──────────────┤
                     │ id (PK)      │     │ id (PK)      │
                     │ identifier   │     │ userId (FK)──►│ user.id │
                     │ value        │     │ title        │
                     │ expiresAt    │     │ createdAt    │
                     │ createdAt    │     │ updatedAt    │
                     │ updatedAt    │     └──────────────┘
                     └──────────────┘     
                                          ┌──────────────┐
                                          │   messages   │
                                          ├──────────────┤
                                          │ id (PK)      │
                                          │ conversationId(FK)──►│ conversation.id │
                                          │ role         │  ('user'|'assistant')
                                          │ content      │
                                          │ createdAt    │
                                          └──────────────┘
```

## OAuth Setup Guide

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Set **Homepage URL** to `http://localhost:5173` (or your production URL)
4. Set **Authorization callback URL** to `http://localhost:5173/api/auth/callback/github`
5. Copy the **Client ID** and generate a **Client Secret**
6. Add both to your `.env` file

### Google OAuth

1. Go to [Google Cloud Console — Credentials](https://console.cloud.google.com/apis/credentials)
2. Create a new **OAuth 2.0 Client ID** (Web application)
3. Add `http://localhost:5173` to **Authorized JavaScript origins**
4. Add `http://localhost:5173/api/auth/callback/google` to **Authorized redirect URIs**
5. Copy the **Client ID** and **Client Secret** to your `.env` file

### Gmail App Password (for email sending)

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and your device
3. Generate the password and add it as `SMTP_APP_PASSWORD` in `.env`

> **Note:** You must have 2-Step Verification enabled on your Google account to use App Passwords.

## Deployment on Vercel

### 1. Push your code to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository** and select your NexusID repo
3. Vercel will auto-detect SvelteKit — no build settings changes needed

### 3. Configure environment variables

In your Vercel project dashboard, go to **Settings → Environment Variables** and add all the variables from your `.env` file:

| Variable                       | Value                                  |
| ------------------------------ | -------------------------------------- |
| `DATABASE_URL`                 | Your Neon PostgreSQL connection string  |
| `ORIGIN`                       | `https://your-app.vercel.app`          |
| `BETTER_AUTH_SECRET`           | Your random secret                     |
| `GITHUB_CLIENT_ID`             | GitHub OAuth client ID                 |
| `GITHUB_CLIENT_SECRET`         | GitHub OAuth client secret             |
| `GOOGLE_CLIENT_ID`             | Google OAuth client ID                 |
| `GOOGLE_CLIENT_SECRET`         | Google OAuth client secret             |
| `SMTP_USER`                    | Your Gmail address                     |
| `SMTP_APP_PASSWORD`            | Gmail app password                     |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API key                         |

> **Important:** Update `ORIGIN` to match your Vercel deployment URL (e.g., `https://nexusid.vercel.app`). This is critical for auth callbacks and CSRF to work correctly.

### 4. Update OAuth callback URLs

After deployment, update your OAuth providers with the production callback URLs:

- **GitHub:** `https://your-app.vercel.app/api/auth/callback/github`
- **Google:** `https://your-app.vercel.app/api/auth/callback/google`

### 5. Deploy

Click **Deploy** in Vercel. Subsequent pushes to `main` will auto-deploy.

```bash
# Or deploy via Vercel CLI
npm i -g vercel
vercel --prod
```

### Vercel CLI Deployment (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project (first time)
vercel link

# Set environment variables
vercel env add DATABASE_URL
vercel env add ORIGIN
vercel env add BETTER_AUTH_SECRET
vercel env add GITHUB_CLIENT_ID
vercel env add GITHUB_CLIENT_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add SMTP_USER
vercel env add SMTP_APP_PASSWORD
vercel env add GOOGLE_GENERATIVE_AI_API_KEY

# Deploy to production
vercel --prod
```

## Langchain Memory System

The chat system uses Langchain with persistent conversation memory:

### How It Works

1. **Conversation Creation** — Each chat session gets a unique ID stored in the database
2. **Message Storage** — All user and assistant messages are saved to `messages` table
3. **Context Loading** — On each new message, previous messages are retrieved and included
4. **Langchain Integration** — Messages are formatted for Langchain's `ConversationChain`
5. **Streaming Response** — AI response streams to client while being stored in database

### Memory Strategies

Three memory types are available (configured in `src/lib/server/langchain-chain.ts`):

- **Buffer** (default) — Keeps full conversation history
- **Window** — Maintains only last 10 messages (efficient)
- **Summary** — Summarizes old messages (best for long conversations)

### API Endpoints

```
POST   /api/chat                          # Send message with memory context
GET    /api/chat/messages?conversationId  # Fetch conversation history
POST   /api/conversations/get-or-create   # Get or create conversation
GET    /api/conversations/latest          # Fetch latest conversation
```

## Troubleshooting

| Issue                              | Solution                                                             |
| ---------------------------------- | -------------------------------------------------------------------- |
| `DATABASE_URL` connection error    | Verify your Neon connection string includes `?sslmode=require`       |
| OAuth callback mismatch            | Ensure `ORIGIN` matches your actual URL (no trailing slash)          |
| Emails not sending                 | Check Gmail 2FA is enabled and app password is correct               |
| `db:push` fails                    | Ensure `DATABASE_URL` is set and the database is accessible          |
| Auth schema out of sync            | Run `pnpm auth:schema` then `pnpm db:push`                          |
| Vercel build fails                 | Check all env variables are set in Vercel dashboard                  |
| Chat not working                   | Verify `GOOGLE_GENERATIVE_AI_API_KEY` is valid and has quota         |
| AI not remembering previous messages | Ensure `conversationId` is being passed in chat requests; check localStorage for persistence |
| Conversation history not loading   | Verify `conversations` and `messages` tables exist; check user auth context |
| Memory context missing             | Check that database messages are being retrieved; review logs via `pnpm db:studio` |

## License

This project is private and not licensed for public distribution.
