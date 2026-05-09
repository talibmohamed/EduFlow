Last updated: 2026-05-09

## Base Setup

- Local backend URL is `http://localhost:5000`.
- Send `Content-Type: application/json`.
- Send `Authorization: Bearer <jwt>` for protected routes.
- `npm run dev` starts the backend in watch mode.
- `npm run start` starts the backend normally.
- `npm run db:migrate` creates the database tables.
- `npm run db:seed` loads demo data.
- Seed password is `Password123!`.
- Teacher seed login is `pierre@eduflow.test`.
- Parent seed login is `sophie@eduflow.test`.
- Child seed logins are `lucas@eduflow.test` and `emma@eduflow.test`.

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

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"pierre@eduflow.test","password":"Password123!"}'
```

### Me

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <jwt>"
```
