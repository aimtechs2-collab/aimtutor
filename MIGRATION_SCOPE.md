# Next.js Rewrite Scope

This folder is a clean rewrite workspace and does not modify `Frontend` or `backend`.

## Target

- Rebuild the existing Geo Aware LMS as a single Next.js application.
- Preserve current behavior and endpoint contracts as much as possible.

## Phase status (baseline delivered)

### Phase 1 – App routes and UX parity (initial)

- Geo shell: `/:country/:region/:city/*` with training drill-down (category, subcategory, course).
- Root `/` redirects using `/api/detect-location` (Vercel-style headers + browser fallback).
- Auth: login, signup + OTP, forgot/reset password (top-level routes), Google sign-in hook.
- Student area: `/student/*` with profile, courses, resources, payments, live sessions, notifications.
- Enrollment: Razorpay paid flow + free enrollment shim.
- Search and privacy placeholder pages.

### Phase 2 – API compatibility layer (initial)

- `src/app/api/v1/[...path]/route.ts` proxies most `/api/v1/*` calls to the Flask backend (`NEXT_PUBLIC_BACKEND_URL`).
- `src/app/api/v1/enrollments/enroll-free/route.ts` maps legacy `enroll-free` to Flask `create-enrollments/:id`.
- `next.config.ts` still rewrites `/uploads/*` and `/api/google-reviews` to the backend.

### Phase 3 – Full backend-in-Next (not done)

- Database ORM, migrations, admin tooling, webhooks, certificate PDFs, and all edge cases still live in Flask until ported.

### Phase 4 – Parity QA (not done)

- Automated comparison tests against legacy UI and API responses.

## Run locally

1. Start Flask API (existing `backend`) on port 5000.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_BACKEND_URL`.
3. From `nextjs-lms`: `npm run dev`.
