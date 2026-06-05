Last updated: 2026-06-05

## Global Rules

- Base URL is `http://localhost:5000`.
- Request and response bodies are JSON.
- Send `Content-Type: application/json` for JSON requests.
- Authenticated requests use `Authorization: Bearer <jwt>`.
- Roles are `child`, `parent`, and `teacher`.
- Success shape is `{ success, message?, data? }`.
- Error shape is `{ success: false, message }`.
- API responses never include `password_hash`.

## Endpoints

### GET /

- Auth: no.
- Allowed roles: all.
- Request body: none.
- Success: `200`.

```json
{
  "success": true,
  "message": "EduFlow API is running"
}
```

- Common errors:
  - None.

### POST /api/auth/register

- Auth: no.
- Allowed roles: all.
- Request body:

```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "child|parent|teacher"
}
```

- Success: `201`.

```json
{
  "success": true,
  "message": "Account created",
  "data": {
    "token": "jwt",
    "user": {
      "id": 1,
      "name": "Lucas Martin",
      "email": "lucas@example.test",
      "role": "child"
    }
  }
}
```

- Common errors:
  - `400`, `name invalid`.
  - `400`, `email invalid`.
  - `400`, `password invalid`.
  - `400`, `role invalid`.
  - `409`, `Email already registered`.

### POST /api/auth/login

- Auth: no.
- Allowed roles: all.
- Request body: one of (exclusive):

```json
{ "email": "string", "password": "string" }
```

```json
{ "username": "string", "pin": "string (4 digits)" }
```

- Parents and teachers use email + password. Children use username + 4-digit PIN.
- Success: `200`.

```json
{
  "success": true,
  "message": "Logged in",
  "data": {
    "token": "jwt",
    "user": {
      "id": 1,
      "name": "Pierre Dubois",
      "email": "pierre@eduflow.test",
      "username": null,
      "role": "teacher"
    }
  }
}
```

- For a child the response shape is the same with `email: null` and `username: "lucas"`.
- Common errors:
  - `400`, `Provide either email+password or username+pin`.
  - `400`, `Provide only one credential pair`.
  - `400`, `PIN must be 4 digits`.
  - `401`, `Invalid credentials`.

### GET /api/auth/me

- Auth: yes.
- Allowed roles: authenticated.
- Request body: none.
- Success: `200`.

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "Pierre Dubois",
      "email": "pierre@eduflow.test",
      "username": null,
      "role": "teacher"
    }
  }
}
```

- `email` is `null` for child users; `username` is `null` for parent/teacher users.
- Common errors:
  - `401`, `Authentication required`.

### POST /api/daily-state

- Auth: yes. Allowed roles: `child`.
- Request body: `{ "energy_level": "low|medium|high", "focus_level": "low|medium|high" }`.
- Success: `201`, `{ success, message: "Daily state saved", data: { dailyState } }`.
- Common errors:
  - `400`, `energy_level invalid` / `focus_level invalid`.
  - `409`, `Daily state already set for today` (one immutable state per UTC day).

### GET /api/daily-state/me

- Auth: yes. Allowed roles: `child`.
- Success: `200`, `{ success, data: { dailyState } }`; `dailyState` is `null` if none today.

### GET /api/child/adapted-homework

- Auth: yes. Allowed roles: `child`.
- Selects homework via the adaptation algorithm (energy/focus -> 1, 3, or all; priority desc then due date asc). Excludes fully completed and past-due homework. Each homework includes a nested `tasks` array.
- Success: `200`, `{ success, data: { dailyState: { energyLevel, focusLevel }, homework: [...] } }`.
- Common errors:
  - `409`, `Daily state required for today`.

### GET /api/child/homework/:id

- Auth: yes. Allowed roles: `child`. Only the child's own homework.
- Success: `200`, `{ success, data: { homework: { ..., tasks: [...] } } }`.
- Common errors: `404`, `Homework not found`.

### PATCH /api/tasks/:id/complete

- Auth: yes. Allowed roles: `child`. Only tasks under the child's homework.
- Sets `tasks.status = 'completed'` and writes one `task_progress` row for today.
- Success: `200`, `{ success, message: "Task completed", data: { task } }`.
- Common errors: `404`, `Task not found`.

### PATCH /api/tasks/:id/postpone

- Same as complete, with status `postponed`. Success message `Task postponed`.

### GET /api/child/progress

- Auth: yes. Allowed roles: `child`.
- Success: `200`, `{ success, data: { completed, postponed, message } }` (today's counts + positive message).
