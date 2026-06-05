Last updated: 2026-06-05

## Base Setup

- Local backend URL is `http://localhost:5000`.
- Send `Content-Type: application/json`.
- Send `Authorization: Bearer <jwt>` for protected routes.
- `npm run dev` starts the backend in watch mode.
- `npm run start` starts the backend normally.
- `npm run db:migrate` creates the database tables.
- `npm run db:seed` loads demo data.

## Seed Credentials

Parents and teachers (email + password = `Password123!`):

- `pierre@eduflow.test` (teacher)
- `sophie@eduflow.test` (parent)

Children (username + 4-digit PIN):

- `lucas` / `2026`
- `emma`  / `1234`

## JWT Handling

- Register returns `data.token` and `data.user`.
- Login returns `data.token` and `data.user`.
- Store the token in `localStorage`.
- Use key `eduflow_token`.
- On app startup, call `/api/auth/me`.
- On `/api/auth/me` success, restore `data.user`.
- On `401`, clear the token.
- After clearing the token, redirect to `/login`.
- Logout is client-only.
- No server logout endpoint exists.

## Role-Based Routing

| Role | Landing route |
| --- | --- |
| `child` | `/child/dashboard` |
| `parent` | `/parent/dashboard` |
| `teacher` | `/teacher/dashboard` |

## Example Requests

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Child","email":"test-child@example.test","password":"Password123!","role":"child"}'
```

### Login (parent or teacher)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pierre@eduflow.test","password":"Password123!"}'
```

### Login (child)

Children use a username + 4-digit PIN. The endpoint is the same:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"lucas","pin":"2026"}'
```

The response shape matches the email path; `user.email` is `null` and
`user.username` is set. Sending both pairs together returns `400 Provide
only one credential pair`.

### Me

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <jwt>"
```

## Field Naming Convention (EDU-D child endpoints)

- Request bodies use `snake_case` (e.g. `energy_level`, `focus_level`).
- Response bodies use `camelCase` (e.g. `energyLevel`, `focusLevel`, `childId`, `createdAt`).
- Do not reuse the keys you sent when reading the response back; map them.
- This split is intentional: requests mirror the DB columns, responses match JS/JSON client conventions.

## Child Endpoints (EDU-D)

All child endpoints require a `child` JWT (`Authorization: Bearer <jwt>`). Full spec in `api-spec.md`.

### Submit today's daily state

`POST /api/daily-state`: once per day per child; returns `409` if already set today.

```bash
curl -X POST http://localhost:5000/api/daily-state \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"energy_level":"high","focus_level":"medium"}'
```

Response (note the `camelCase`):

```json
{
  "success": true,
  "message": "Daily state saved",
  "data": {
    "dailyState": {
      "id": 1,
      "childId": 7,
      "date": "2026-06-03",
      "energyLevel": "high",
      "focusLevel": "medium",
      "createdAt": "2026-06-03T08:00:00.000Z"
    }
  }
}
```

### Read today's daily state

`GET /api/daily-state/me`: returns `data.dailyState` (or `null` if not set yet today).

### Other child endpoints

- `GET /api/child/adapted-homework`: homework adapted to today's energy/focus (needs a daily state set today).
- `GET /api/child/homework/:id`: one homework with its tasks.
- `PATCH /api/tasks/:id/complete`: mark a task done.
- `PATCH /api/tasks/:id/postpone`: postpone a task (no guilt).
- `GET /api/child/progress`: completed/postponed counts + a positive message.
