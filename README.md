# EduFlow

EduFlow is a homework management web app for children aged 8-14 with chronic illness. This repository contains the MVP monorepo for the ISEP Genie Logiciel 2026 school project.

## Monorepo Layout

- `server/` - Node.js + Express API using PostgreSQL through `pg` and raw SQL.
- `server/docs/` - Backend status, API spec, API contract, and frontend integration guide.
- `client/` - Vite + React + Tailwind + HeroUI frontend.

## Current Scope

Implemented:

- PostgreSQL schema and idempotent seed data.
- Supabase Postgres connection through `DATABASE_URL`.
- Express health check.
- JWT authentication.
- Auth routes for register, login, and session restore.
- Role middleware for protected backend routes.
- Frontend login, register, logout, session restore, 403 page, and placeholder role dashboards.

Also implemented:

- Daily state endpoints (child submits energy/focus once per day).
- Adapted homework endpoint (algorithm selects 1, 3, or all homework based on energy/focus).
- Task complete and postpone actions.
- Child progress endpoint (completed/postponed counts + positive message).
- Parent children list and child creation.
- Parent child detail: energy/focus history (last 30 days) and task progress stats.

Not implemented yet:

- Teacher homework creation and reports.
- Weekly summary for teacher.

## Requirements

- Node.js
- npm
- PostgreSQL database on Supabase

## Environment Variables

Create `server/.env` from `server/.env.example`.

- `DATABASE_URL` - Supabase PostgreSQL connection string. Use the Session pooler URL if direct IPv6 connection fails.
- `JWT_SECRET` - Required. Must be at least 32 characters. The server exits on boot if missing or too short.
- `PORT` - API port, defaults to `5000`.

Create `client/.env` from `client/.env.example` if you need to override the API URL.

- `VITE_API_URL` - API base URL, defaults to `http://localhost:5000`.

## Run The Server

```bash
cd server
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

The API health check is available at `http://localhost:5000/`.

## Run The Client

```bash
cd client
npm install
npm run dev
```

The Vite app is available at `http://localhost:5173/`.

## Demo Credentials

Parents and teachers log in with email + password (`Password123!`):

| Email | Role |
|---|---|
| `pierre@eduflow.test` | teacher |
| `sophie@eduflow.test` | parent |

Children log in with username + 4-digit PIN:

| Username | PIN | Role |
|---|---|---|
| `lucas` | `2026` | child |
| `emma`  | `1234` | child |

## API Routes

Full details in `server/docs/api-spec.md`.

**Auth** — `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`

**Child** — `POST /api/daily-state`, `GET /api/daily-state/me`, `GET /api/child/adapted-homework`, `GET /api/child/homework/:id`, `PATCH /api/tasks/:id/complete`, `PATCH /api/tasks/:id/postpone`, `GET /api/child/progress`

**Parent** — `GET /api/parent/children`, `POST /api/parent/children`, `GET /api/parent/children/:id/daily-states`, `GET /api/parent/children/:id/progress`

**Teacher** — _in progress_

Authenticated requests use:

```text
Authorization: Bearer <jwt>
```

Full backend details are in:

- `server/docs/backend-status.md`
- `server/docs/api-spec.md`
- `server/docs/api-contract.json`
- `server/docs/integration-guide.md`
