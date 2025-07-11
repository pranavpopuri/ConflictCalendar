# Authentication API

Authentication endpoints for user registration, login, and password management.

## POST /auth/register

Register a new user account.

### Request

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Request Body

| Field      | Type   | Required | Description                                      |
| ---------- | ------ | -------- | ------------------------------------------------ |
| `username` | string | Yes      | Username (3-50 chars, alphanumeric + underscore) |
| `email`    | string | Yes      | Valid email address                              |
| `password` | string | Yes      | Password (minimum 6 characters)                  |

### Response

**Success (201 Created):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (400 Bad Request):**

```json
{
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ]
}
```

### Validation Rules

- **Username**: 3-50 characters, letters, numbers, underscores only
- **Email**: Valid email format, must be unique
- **Password**: Minimum 6 characters

---

## POST /auth/login

Authenticate user and receive JWT token.

### Request

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Request Body

| Field      | Type   | Required | Description              |
| ---------- | ------ | -------- | ------------------------ |
| `email`    | string | Yes      | Registered email address |
| `password` | string | Yes      | User password            |

### Response

**Success (200 OK):**

```json
{
  "message": "Login successful",
  "user": {
    "id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (401 Unauthorized):**

```json
{
  "message": "Invalid credentials"
}
```

---

## POST /auth/forgot-password

Request password reset email.

### Request

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### Request Body

| Field   | Type   | Required | Description              |
| ------- | ------ | -------- | ------------------------ |
| `email` | string | Yes      | Registered email address |

### Response

**Success (200 OK):**

```json
{
  "message": "Password reset email sent"
}
```

**Error (404 Not Found):**

```json
{
  "message": "User not found"
}
```

### Email Content

The reset email contains:

- Secure reset link with token
- Token expires in 1 hour
- Link format: `{FRONTEND_URL}/reset-password?token={reset_token}`

---

## POST /auth/reset-password

Complete password reset with token.

### Request

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "abc123def456...",
  "password": "newpassword",
  "confirmPassword": "newpassword"
}
```

### Request Body

| Field             | Type   | Required | Description                    |
| ----------------- | ------ | -------- | ------------------------------ |
| `token`           | string | Yes      | Reset token from email         |
| `password`        | string | Yes      | New password (minimum 6 chars) |
| `confirmPassword` | string | Yes      | Password confirmation          |

### Response

**Success (200 OK):**

```json
{
  "message": "Password reset successful"
}
```

**Error (400 Bad Request):**

```json
{
  "message": "Invalid or expired reset token"
}
```

### Security Notes

- Reset tokens are cryptographically secure (32 bytes)
- Tokens are hashed before storage in database
- Tokens expire after 1 hour
- Tokens are single-use (deleted after successful reset)

---

## Implementation Details

### JWT Token Structure

```json
{
  "userId": "64f5a1b2c3d4e5f6a7b8c9d0",
  "iat": 1693123456,
  "exp": 1693728256
}
```

- **Expiration**: 7 days from issue
- **Algorithm**: HS256
- **Storage**: Client localStorage

### Password Security

- **Hashing**: bcrypt with 10 salt rounds
- **Storage**: Only hashed passwords in database
- **Validation**: Plain text never stored or logged

### Reset Token Security

- **Generation**: `crypto.randomBytes(32).toString('hex')`
- **Hashing**: bcrypt before database storage
- **Expiration**: 1 hour from generation
- **Cleanup**: Expired tokens removed periodically
