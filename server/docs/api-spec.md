Last updated: 2026-05-09

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
- Request body:

```json
{
  "email": "string",
  "password": "string"
}
```

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
      "role": "teacher"
    }
  }
}
```

- Common errors:
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
      "role": "teacher"
    }
  }
}
```

- Common errors:
  - `401`, `Authentication required`.
