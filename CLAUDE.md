@AGENTS.md

## Backend (cloned into Next.js)

- **API**: All `/api/v1/*` is handled in-app (no Flask proxy). Entry: `src/app/api/v1/[...path]/route.ts` → `src/server/api/dispatch.ts` → `src/server/api/registry.ts`.
- **DB**: Prisma 7 + SQLite (`prisma/schema.prisma`, `prisma/dev.db`). Prisma client uses `@prisma/adapter-better-sqlite3`; see `src/lib/prisma.ts`.
- **Auth**: JWT (jose), bcrypt + Werkzeug pbkdf2 password verification, token blacklist, pending-registration cookie for register/verify-otp.
- **Implemented**: auth (register, verify-otp, login, refresh, logout, me, change-password), public (mastercategories, subcategories, courses), users (profile, dashboard, certificates), enrollments (list, create, enroll-free, progress), contact CRUD, notifications (list, mark read, delete), live-sessions (list). Others return 501 with route hint.
- **Run**: `npm run dev` (no Flask). Set `DATABASE_URL` (e.g. `file:./dev.db`) and optionally `JWT_SECRET_KEY`, `DEV_OTP` (default 123456).
