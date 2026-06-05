# Supabase Auth & Storage — 10-minute setup

The app now requires every user to sign in (email + password) before taking a readiness check. Every completed assessment is saved to the user's account; users can view their full history.

This document walks through the one-time Supabase setup.

---

## 1. Create a Supabase project (free)

1. Go to **https://supabase.com** → Sign up (GitHub or email)
2. **New project** → name it `airtel-readiness-check` (or anything)
3. Pick a strong DB password (you won't need it for normal use, but keep it safe)
4. Region: **Mumbai (ap-south-1)** for lowest latency from Indian users
5. Click **Create new project** — takes ~2 minutes to provision

---

## 2. Run the schema SQL

1. In your project dashboard, open **SQL Editor** (left sidebar)
2. Click **New query**
3. Paste the contents of `supabase/schema.sql` from this repo
4. Click **Run** (or Cmd+Enter)
5. You should see *Success. No rows returned.*

This creates two tables (`profiles`, `assessments`), enables row-level security so users only see their own data, and sets up a trigger that auto-creates a profile when someone signs up.

---

## 3. Disable email confirmation (optional, recommended for dev)

By default Supabase emails users a confirmation link before they can sign in. For dev / staging this slows the flow.

1. **Authentication → Providers → Email**
2. Toggle **Confirm email** off (or leave it on for production)
3. Save

For production, **keep email confirmation on** and configure the email provider (Supabase free tier sends 3 emails/hour through their default SMTP; for higher volume connect Resend / SES / Postmark in **Settings → Auth → SMTP**).

---

## 4. Grab your project credentials

1. **Project Settings → API**
2. Copy:
   - **Project URL** (looks like `https://xyz.supabase.co`)
   - **anon public** key (long JWT-shaped string)

These two values are safe to expose in the frontend bundle — they're called *anon* keys precisely because they have no privileged access. Row-level security enforces who can read what.

---

## 5. Configure the app

Create a local env file:

```sh
cp .env.example .env.local
```

Edit `.env.local`:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```

Restart the dev server:

```sh
npm run dev
```

You should land on the **Sign in / Create account** screen.

---

## 6. Verify the flow

1. **Create an account** with any email + password (min 6 chars)
2. You should immediately land on the **History** screen showing an empty state
3. Click **Take a new check →** to walk through Intro → Industry → … → Quiz → Results
4. On Results page mount, the assessment is automatically saved
5. Open the **History** menu (top-right avatar dropdown OR header History button) — your new assessment should be there
6. Click **View report →** to re-open it in read-only mode (download-prompt suppressed)
7. Click **Sign out** from the avatar dropdown to test logging out

---

## Production checklist

- [ ] Email confirmation **on** in Supabase Auth settings
- [ ] Custom SMTP configured (Resend / SES / Postmark)
- [ ] Custom domain in Supabase Auth → URL Configuration
- [ ] Reduce JWT expiry to 1 hour, enable refresh tokens (already default in our client)
- [ ] Backup policy: Supabase Pro plan ($25/month) gives daily backups; free tier has no point-in-time recovery
- [ ] Rate limit signups: enable Cloudflare Turnstile / hCaptcha in Auth settings to block bot signups

## What's free vs. paid

| Limit | Free | Pro ($25/mo) |
|-------|------|-------------|
| Monthly active users | 50,000 | 100,000 |
| Postgres storage | 500 MB | 8 GB |
| Auth emails | 3/hour default SMTP | Unlimited with custom SMTP |
| File storage | 1 GB | 100 GB |
| Daily backups | ❌ | ✅ |
| Custom domains | ❌ | ✅ |

For Readiness Check volume (1K-10K MAU realistic), free tier is plenty.
