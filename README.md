# EduFlow

EduFlow is a homework management web app for children aged 8-14 with chronic illness. This repository contains the MVP monorepo for the ISEP Genie Logiciel 2026 school project.

## Monorepo Layout

- `server/` - Node.js + Express API using PostgreSQL through `pg` and raw SQL.
- `client/` - Vite + React + Tailwind frontend.

`server/docs/` will be added in the next phase.

## Requirements

- Node.js
- npm
- PostgreSQL database on Supabase

## Environment Variables

Create `server/.env` from `server/.env.example`.

- `DATABASE_URL` - Supabase PostgreSQL connection string.
- `JWT_SECRET` - Placeholder for the next auth phase.
- `PORT` - API port, defaults to `5000`.

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
