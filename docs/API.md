# Patogh API Reference

Base URL: `http://localhost:8080`

Interactive docs (Swagger UI): **http://localhost:8080/swagger**

All authenticated endpoints require:
```
Authorization: Bearer <access_token>
```

---

## Authentication — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | No | Login with phone + password |
| POST | `/api/auth/send-otp` | No | Request OTP for phone number |
| POST | `/api/auth/verify-otp` | No | Verify OTP and receive tokens |
| POST | `/api/auth/register` | No | Register new customer account |
| POST | `/api/auth/refresh` | No | Refresh access token |
| POST | `/api/auth/logout` | Yes | Revoke refresh token |

### Login Request
```json
POST /api/auth/login
{
  "phoneNumber": "09333333333",
  "password": "Test@1234"
}
```

### Login Response
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "...",
  "expiresIn": 1440,
  "user": {
    "id": "...",
    "phoneNumber": "09333333333",
    "role": "Customer"
  }
}
```

---

## Restaurants — `/api/restaurants`

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/restaurants` | No | Any | List approved restaurants (paginated) |
| GET | `/api/restaurants/{id}` | No | Any | Get restaurant details |
| POST | `/api/restaurants` | Yes | Owner | Create new restaurant |
| PUT | `/api/restaurants/{id}` | Yes | Owner | Update restaurant info |
| DELETE | `/api/restaurants/{id}` | Yes | Owner/Admin | Delete restaurant |
| POST | `/api/restaurants/{id}/images` | Yes | Owner | Upload restaurant image |

### List Query Parameters
- `page` (int, default: 1)
- `pageSize` (int, default: 10)
- `search` (string) — search by name or location
- `foodType` (string) — filter by food type

---

## Tables — `/api/restaurants/{restaurantId}/tables`

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/restaurants/{id}/tables` | No | Any | List tables for a restaurant |
| POST | `/api/restaurants/{id}/tables` | Yes | Owner | Add table |
| PUT | `/api/restaurants/{id}/tables/{tableId}` | Yes | Owner | Update table |
| DELETE | `/api/restaurants/{id}/tables/{tableId}` | Yes | Owner | Remove table |

### Table Object
```json
{
  "id": "...",
  "tableNumber": 1,
  "capacity": 4
}
```

---

## Reservations — `/api/reservations`

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/reservations` | Yes | Customer | Create reservation |
| GET | `/api/reservations/my` | Yes | Customer | List own reservations |
| GET | `/api/reservations/{id}` | Yes | Customer/Owner/Admin | Get reservation detail |
| POST | `/api/reservations/{id}/confirm` | Yes | Owner | Confirm reservation |
| POST | `/api/reservations/{id}/cancel` | Yes | Customer/Owner | Cancel reservation |
| POST | `/api/reservations/{id}/complete` | Yes | Owner | Mark as completed |

### Create Reservation Request
```json
POST /api/reservations
{
  "restaurantId": "...",
  "tableId": "...",
  "customerName": "علی رضایی",
  "customerPhone": "09333333333",
  "reservationDate": "2026-07-01",
  "startTime": "14:00:00",
  "endTime": "16:00:00",
  "guestCount": 3,
  "notes": "لطفاً میز کنار پنجره باشد"
}
```

### Reservation Status Values
- `Pending` — awaiting manager confirmation
- `Confirmed` — confirmed by manager
- `Cancelled` — cancelled by customer or manager
- `Completed` — visit completed

---

## Admin Panel — `/api/admin`

> Requires `Admin` role.

| Method | Path | Description |
|---|---|---|
| GET | `/api/admin/restaurants` | List all restaurants (including pending) |
| POST | `/api/admin/restaurants/{id}/approve` | Approve restaurant |
| POST | `/api/admin/restaurants/{id}/reject` | Reject restaurant |
| GET | `/api/admin/users` | List all users |

---

## Manager Panel — `/api/manager`

> Requires `RestaurantOwner` role.

| Method | Path | Description |
|---|---|---|
| GET | `/api/manager/restaurants` | List owned restaurants |
| GET | `/api/manager/reservations` | List all reservations for owned restaurants |

---

## Health Checks

| Method | Path | Description |
|---|---|---|
| GET | `/health/live` | Liveness probe |
| GET | `/health/ready` | Readiness probe (checks DB + Redis) |

---

## Error Responses

All errors follow a consistent envelope:

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Bad Request",
  "status": 400,
  "errors": {
    "phoneNumber": ["Phone number format is invalid"]
  }
}
```

Common status codes:
- `400` Bad Request — validation failed
- `401` Unauthorized — missing or invalid JWT
- `403` Forbidden — insufficient role
- `404` Not Found
- `409` Conflict — e.g., time slot already booked
- `429` Too Many Requests — rate limiter triggered
