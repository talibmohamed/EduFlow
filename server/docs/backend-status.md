Last updated: 2026-06-05

## Current State

- Express API is running from `server.js`.
- Postgres access uses `pg` with a Supabase session pooler URL.
- SSL is enabled with `rejectUnauthorized: false`.
- JWT auth is implemented for register, login, and session restore.
- Migration and seed scripts are available.
- Role-protected middleware is available with `requireRole`.
- `/server/docs` is the frontend source of truth for backend behavior.

## Implemented Features

### Core API

- `GET /` health check works.
- JSON request bodies are enabled.
- CORS allows the Vite client at `http://localhost:5173`.
- CORS allows `Content-Type` and `Authorization` headers.

### Development Tooling

- `npm run dev` starts Nodemon.
- `npm run start` starts Node directly.
- `npm run db:migrate` applies `db.sql`.
- `npm run db:seed` resets and loads demo data.
- Seeded parent and teacher passwords are `Password123!`.
- `pierre@eduflow.test` is a teacher.
- `sophie@eduflow.test` is a parent.
- `lucas` (PIN `2026`) is a child.
- `emma` (PIN `1234`) is a child.

### Authentication

- `POST /api/auth/register` creates child, parent, or teacher accounts.
- `POST /api/auth/login` accepts either `{email, password}` (parents and
  teachers) or `{username, pin}` (children).
- Child PIN is 4 digits, stored as a bcrypt hash in `password_hash`.
- `GET /api/auth/me` restores the current authenticated user.
- `requireAuth` verifies Bearer tokens.
- `requireRole` blocks users outside allowed roles.

## Pending Features

- Daily state endpoints.
- Homework CRUD.
- Adaptation algorithm.
- Child task complete and postpone actions.
- Parent dashboard data.
- Teacher reports.
- Weekly count.

## Known Behavior Notes

- `GET /api/auth/me` returns `{ success, data }` with no message.
- `JWT_SECRET` shorter than 32 chars causes server boot to fail.
- Login returns the same `Invalid credentials` message for both missing user and wrong secret.
- Register only accepts roles `child`, `parent`, and `teacher`.
- `users.email` is nullable; `users.username` is unique nullable.
- A CHECK constraint requires at least one of `email` or `username` to be set.
- Children have `username` + `pin`; parents and teachers have `email` + `password`.
- The `pin` field is validated as exactly 4 digits before bcrypt comparison.
- `daily_states.date` is a DATE column.
- UTC server time is the source of truth for "today".
- This matters once feature endpoints land.
- Seeded parent-child and teacher-child links are out of MVP scope for self-service flows.

## Frontend Ready Areas

- Login.
- Register.
- Session restore via `/me`.
- Role-based redirect.
- Logout.
- 403 page.
