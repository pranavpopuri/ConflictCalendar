# Authentication API

Authentication endpoints implemented in `/backend/controllers/auth.controller.ts`.

## Registration {#register}

**POST** `/api/auth/register`

```typescript
// Controller implementation
export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body

  // Check if user exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] })

  // Create new user (password auto-hashed in pre-save middleware)
  const user = new User({ username, email, password })
  await user.save()

  const token = generateToken(user._id.toString())
  res.status(201).json({ success: true, data: { token, user } })
}
```

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepass"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": { "id": "...", "username": "johndoe", "email": "john@example.com" }
  }
}
```

## Login {#login}

**POST** `/api/auth/login`

```typescript
// Controller implementation
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  const isMatch = await user.comparePassword(password) // bcrypt comparison

  const token = generateToken(user._id.toString())
  res.json({ success: true, data: { token, user } })
}
```

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepass"
}
```

## Password Reset Request {#forgot-password}

**POST** `/api/auth/forgot-password`

```typescript
// Controller implementation
export const requestPasswordReset = async (req: Request, res: Response) => {
  const { email } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    // Always return success to prevent email enumeration
    return res.json({ success: true, message: "Reset link sent if account exists" })
  }

  const resetToken = user.generatePasswordResetToken() // Creates hashed token + expiry
  await user.save()

  await emailService.sendPasswordResetEmail(email, resetToken)
  res.json({ success: true, message: "Reset link sent if account exists" })
}
```

## Password Reset Completion {#reset-password}

**POST** `/api/auth/reset-password`

```typescript
// Controller implementation
export const resetPassword = async (req: Request, res: Response) => {
  const { token, password } = req.body

  // Hash token to match stored version
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })

  user.password = password // Auto-hashed in pre-save middleware
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()
}
```

## Get Current User

**GET** `/api/auth/me`

```typescript
// Requires authenticate middleware
export const getMe = async (req: AuthRequest, res: Response) => {
  // req.user populated by authenticate middleware
  res.json({ success: true, data: { user: req.user } })
}
```

## Validation Rules

Defined in `/backend/controllers/auth.controller.ts`:

```typescript
export const registerValidation = [
  body("username")
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username: 3-50 chars, alphanumeric + underscore only"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password: min 6 chars")
]

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required")
]
```
