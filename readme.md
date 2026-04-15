# Book My Ticket — ChaiCode Hackathon

A minimal **movie seat booking** app with **JWT authentication** and **PostgreSQL-backed** seat reservation.

- **Register / Login**
- **Browse seats**
- **Book a seat (protected route)**

## Demo pages

- **Auth page**: `GET /` (or `GET /register`)
- **Booking page**: `GET /booking`

## Tech stack

- **Node.js**, **Express**
- **PostgreSQL** (`pg`)
- **JWT** (`jsonwebtoken`)
- Simple HTML UI: `register.html`, `index.html`

## Getting started

### Prerequisites

- Node.js (LTS recommended)
- Yarn
- A PostgreSQL database (local or hosted)

### Install

```bash
yarn install
```

### Environment variables

Create a `.env` file in the project root.

| Variable | Required | Example | Notes |
|---|---:|---|---|
| `PORT` | no | `8080` | Server port |
| `DATABASE_URL` | yes | `postgresql://user:pass@host:5432/db` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | yes | `a-very-long-random-secret` | Keep it private |
| `JWT_ACCESS_EXPIRES_IN` | no | `15m` | Defaults to `15m` |
| `CORS_ORIGIN` | no | `http://localhost:5173` | Only needed if you call APIs from a different origin |
| `NODE_ENV` | no | `development` | Enables secure cookies only in production |

Example `.env`:

```bash
PORT=8080
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DBNAME
JWT_ACCESS_SECRET=replace_me_with_a_long_random_secret
JWT_ACCESS_EXPIRES_IN=15m

# Optional (only if using a separate frontend origin)
# CORS_ORIGIN=http://localhost:5173
# NODE_ENV=development
```

### Run

```bash
yarn start
```

Open:
- `http://localhost:8080/` for Register/Login
- `http://localhost:8080/booking` for seat booking

## API reference

Base URL: `http://localhost:8080`

### Auth

#### `POST /auth/register`

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@doe.com",
  "password": "password123"
}
```

Returns JSON containing `token` and sets a `token` **httpOnly cookie**.

#### `POST /auth/login`

```json
{
  "email": "john@doe.com",
  "password": "password123"
}
```

Returns JSON containing `token` and sets a `token` **httpOnly cookie**.

### Seats

#### `GET /seat`

Returns all seats.

#### `PUT /seat/:id` (protected)

Books a seat by id for the authenticated user.

## Authentication

Protected routes accept the JWT in **either** form:

- **Authorization header**:

```http
Authorization: Bearer <JWT_TOKEN>
```

- **Cookie**:
  - `token=<JWT_TOKEN>` (httpOnly cookie)

The bundled booking UI uses `localStorage` and sends the JWT via the `Authorization` header.

## Database expectations

This project expects at minimum:

- `users` table with columns like:
  - `id`, `"first name"`, `last_name`, `email`, `password`
- `seats` table with columns like:
  - `id`, `is_booked` (boolean), `name` (booked-by)

## Project structure (high level)

- `index.mjs` — Express server bootstrap + routes
- `modules/auth/*` — register/login + auth middleware
- `modules/TicketBookingService/*` — seat list + booking
- `common/utils/*` — DB + JWT helpers
- `register.html`, `index.html` — UI pages

## Troubleshooting

- **401 on booking**
  - Ensure you’re sending `Authorization: Bearer <token>` or that the `token` cookie is present.
- **Database connection errors**
  - Verify `DATABASE_URL` and that your DB host is reachable (DNS/network).

## License

MIT
