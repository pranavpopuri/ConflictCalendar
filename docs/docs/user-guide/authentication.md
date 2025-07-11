# Authentication

This guide covers how to use the authentication features in ConflictCalendar.

## User Registration

### Creating a New Account

1. **Navigate to the Login Page**
   - Click "Login" in the navigation bar
   - Or visit the app URL directly (you'll be redirected to login)

2. **Switch to Registration**
   - Click "Don't have an account? Register" link

3. **Fill Registration Form**
   - **Username**: 3-50 characters, letters, numbers, and underscores only
   - **Email**: Valid email address (used for password reset)
   - **Password**: Minimum 6 characters

4. **Submit Registration**
   - Click "Register" button
   - You'll be automatically logged in upon successful registration

### Registration Validation

The system validates registration data:

- **Username Requirements**:
  - Length: 3-50 characters
  - Characters: Letters (a-z, A-Z), numbers (0-9), underscores (_)
  - Must be unique across all users

- **Email Requirements**:
  - Valid email format
  - Must be unique across all users
  - Used for password reset functionality

- **Password Requirements**:
  - Minimum 6 characters
  - No other complexity requirements

### Registration Errors

Common registration errors and solutions:

| Error                                          | Cause                    | Solution                         |
| ---------------------------------------------- | ------------------------ | -------------------------------- |
| "Username already exists"                      | Username taken           | Choose a different username      |
| "Email already exists"                         | Email already registered | Use different email or try login |
| "Username must be between 3 and 50 characters" | Invalid username length  | Adjust username length           |
| "Please enter a valid email"                   | Invalid email format     | Check email format               |
| "Password must be at least 6 characters long"  | Password too short       | Use longer password              |

## User Login

### Logging In

1. **Navigate to Login Page**
   - Click "Login" in the navigation bar

2. **Enter Credentials**
   - **Email**: Your registered email address
   - **Password**: Your account password

3. **Submit Login**
   - Click "Login" button
   - You'll be redirected to the calendar page

### Login Validation

- **Email**: Must be a valid email format
- **Password**: Required field (any length)

### Login Errors

| Error                        | Cause                | Solution                             |
| ---------------------------- | -------------------- | ------------------------------------ |
| "User not found"             | Email not registered | Check email or register new account  |
| "Invalid password"           | Wrong password       | Check password or use password reset |
| "Please enter a valid email" | Invalid email format | Check email format                   |

## Session Management

### Authentication Token

ConflictCalendar uses JWT (JSON Web Tokens) for authentication:

- **Token Storage**: Stored in browser's localStorage
- **Token Expiration**: 7 days from login
- **Auto-Refresh**: No automatic refresh (manual re-login required)

### Login Persistence

- **Browser Session**: Login persists across browser sessions
- **Token Validation**: Checked on each API request
- **Automatic Logout**: When token expires or is invalid

### Logout

1. **Manual Logout**
   - Click "Logout" in the navigation bar
   - Token is removed from localStorage
   - Redirected to login page

2. **Automatic Logout**
   - Occurs when JWT token expires
   - Invalid or corrupted token detected
   - Redirected to login page

## Password Reset

### Requesting Password Reset

1. **Access Reset Form**
   - From login page, click "Forgot your password?"
   - Or navigate to `/reset-password`

2. **Enter Email**
   - Provide your registered email address
   - Click "Send Reset Email"

3. **Check Email**
   - Reset email sent to provided address
   - Contains secure reset link
   - Link expires after 1 hour

### Reset Email Content

The password reset email includes:

- **Subject**: "Password Reset Request"
- **From**: Configured `EMAIL_FROM` address
- **Content**:
  - Confirmation of reset request
  - Secure reset link with token
  - Link expiration notice (1 hour)
  - Instructions if you didn't request reset

### Completing Password Reset

1. **Click Reset Link**
   - Open email and click the reset link
   - Opens password reset form with pre-filled token

2. **Enter New Password**
   - **New Password**: Minimum 6 characters
   - **Confirm Password**: Must match new password

3. **Submit Reset**
   - Click "Reset Password"
   - Redirected to login page
   - Use new password to log in

### Reset Token Security

- **Token Generation**: Cryptographically secure random token
- **Token Storage**: Hashed in database (not plain text)
- **Token Expiration**: 1 hour from generation
- **Single Use**: Token becomes invalid after successful reset

### Password Reset Errors

| Error                                         | Cause                 | Solution                    |
| --------------------------------------------- | --------------------- | --------------------------- |
| "User not found"                              | Email not registered  | Check email or register     |
| "Invalid or expired reset token"              | Token expired/invalid | Request new reset           |
| "Passwords do not match"                      | Confirmation mismatch | Re-enter matching passwords |
| "Password must be at least 6 characters long" | Password too short    | Use longer password         |

## Security Features

### Password Security

- **Hashing**: Passwords hashed using bcrypt (10 salt rounds)
- **Storage**: Only hashed passwords stored in database
- **Validation**: Plain text passwords never logged or stored

### Token Security

- **JWT Secret**: Server-side secret for token signing
- **Token Payload**: Contains user ID and expiration
- **Verification**: Tokens verified on each protected request

### Email Security

- **Reset Tokens**: Cryptographically secure (32 bytes)
- **Token Hashing**: Reset tokens hashed before database storage
- **Email Links**: Tokens included in URL for one-click reset

### Session Security

- **HTTPS**: Production deployments use HTTPS
- **CORS**: Cross-origin requests restricted to frontend domain
- **Token Expiration**: Limited 7-day token lifetime

## API Integration

### Authentication Endpoints

The frontend integrates with these authentication API endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Complete password reset

### Authentication Headers

Protected API requests include:

```javascript
{
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Error Handling

The authentication system provides clear error messages:

- **Validation Errors**: Field-specific validation messages
- **Authentication Errors**: Login failure reasons
- **Reset Errors**: Password reset specific errors
- **System Errors**: Generic error for system issues

---

Next: [Developer Guide](../developer-guide/architecture)
