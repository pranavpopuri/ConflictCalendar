# Configuration

This guide covers the configuration options available in ConflictCalendar.

## Environment Variables

ConflictCalendar uses environment variables for configuration. All variables should be defined in a `.env` file in the project root.

### Database Configuration

| Variable    | Description               | Example                                      | Required |
| ----------- | ------------------------- | -------------------------------------------- | -------- |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/conflictcalendar` | Yes      |

**MongoDB Atlas Example:**
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/conflictcalendar?retryWrites=true&w=majority
```

### Server Configuration

| Variable     | Description                      | Default | Required |
| ------------ | -------------------------------- | ------- | -------- |
| `PORT`       | Server port number               | `5000`  | No       |
| `JWT_SECRET` | Secret key for JWT token signing | -       | Yes      |

**Security Best Practices:**
- Use a strong, random JWT secret (minimum 32 characters)
- Change the default secret in production
- Keep secrets secure and never commit them to version control

### Email Configuration

ConflictCalendar supports multiple email providers for sending password reset emails.

| Variable     | Description          | Example                        | Required |
| ------------ | -------------------- | ------------------------------ | -------- |
| `EMAIL_HOST` | SMTP server hostname | `smtp.gmail.com`               | Yes      |
| `EMAIL_PORT` | SMTP server port     | `587`                          | Yes      |
| `EMAIL_USER` | SMTP username        | `your-email@gmail.com`         | Yes      |
| `EMAIL_PASS` | SMTP password        | `your-app-password`            | Yes      |
| `EMAIL_FROM` | From email address   | `noreply@conflictcalendar.com` | Yes      |

#### Gmail Configuration

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=your-email@gmail.com
```

**Setup Steps:**
1. Enable 2-Factor Authentication
2. Generate App Password in Google Account settings
3. Use the 16-character app password (not your regular password)

#### Mailtrap Configuration (Development)

```bash
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your-mailtrap-username
EMAIL_PASS=your-mailtrap-password
EMAIL_FROM=noreply@conflictcalendar.com
```

#### Other SMTP Providers

ConflictCalendar works with any SMTP provider. Popular options include:

- **SendGrid**: `smtp.sendgrid.net:587`
- **Mailgun**: `smtp.mailgun.org:587`
- **Amazon SES**: `email-smtp.region.amazonaws.com:587`

### Frontend Configuration

| Variable       | Description              | Example                 | Required |
| -------------- | ------------------------ | ----------------------- | -------- |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` | Yes      |

**Environment-specific values:**
- Development: `http://localhost:5173`
- Production: `https://your-domain.com`

This URL is used in password reset emails to generate the correct reset links.

## Package Configuration

### Backend (Root package.json)

The backend configuration includes TypeScript compilation and development scripts:

```json
{
  "scripts": {
    "dev": "set NODE_ENV=development && tsx backend/server.ts",
    "build": "npm install && npm install --prefix frontend && npm run build --prefix frontend",
    "start": "set NODE_ENV=production && tsx backend/server.ts"
  }
}
```

**Key Scripts:**
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build the entire application for production
- `npm start`: Start production server

### Frontend (frontend/package.json)

The frontend uses Vite for fast development and building:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

## TypeScript Configuration

### Backend TypeScript (tsconfig.json)

The project uses TypeScript with modern ES modules and strict type checking:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Frontend TypeScript (frontend/tsconfig.json)

The frontend configuration is optimized for React and Vite:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Vite Configuration

The frontend uses Vite for fast development and optimized builds:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

**Key Features:**
- Hot Module Replacement (HMR)
- API proxy to backend during development
- Optimized production builds

## Tailwind CSS Configuration

The UI uses Tailwind CSS for styling:

```javascript
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [],
}
```

## Database Configuration

### MongoDB Connection Options

```typescript
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!, {
      // Connection options
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
```

### Schema Configuration

The application uses Mongoose schemas with TypeScript interfaces for type safety.

## Security Configuration

### JWT Configuration

```typescript
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  });
};
```

### Password Hashing

```typescript
import bcrypt from 'bcryptjs';

const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

### CORS Configuration

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## Logging Configuration

The application logs important events and errors:

```typescript
console.log('✅ Server running on port', PORT);
console.log('✅ MongoDB Connected');
console.error('❌ Database connection error:', error);
```

**Log Levels:**
- `✅` Success operations
- `❌` Errors and failures
- `ℹ️` Informational messages

---

Next: [Environment Setup](environment-setup)
