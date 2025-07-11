# Environment Setup

This guide provides detailed instructions for setting up different environments for ConflictCalendar development and deployment.

## Development Environment

### Local Development Setup

#### 1. Prerequisites Installation

**Node.js and npm**
```bash
# Check if Node.js is installed
node --version  # Should be 18.0+
npm --version

# If not installed, download from https://nodejs.org/
```

**MongoDB Setup (Choose One)**

**Option A: Local MongoDB**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Windows - Download from MongoDB website
```

**Option B: MongoDB Atlas (Recommended)**
1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free tier cluster
3. Configure network access (whitelist your IP)
4. Create database user
5. Get connection string

#### 2. Project Setup

```bash
# Clone the repository
git clone https://github.com/hipranav7/ConflictCalendar.git
cd ConflictCalendar

# Install dependencies
npm install
cd frontend && npm install && cd ..
```

#### 3. Environment Configuration

Create `.env` file in the project root:

```bash
# Development Environment Variables
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/conflictcalendar
# Or MongoDB Atlas:
# MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/conflictcalendar

# Server
PORT=5000
JWT_SECRET=dev_jwt_secret_change_in_production

# Email (Mailtrap for development)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your-mailtrap-user
EMAIL_PASS=your-mailtrap-pass
EMAIL_FROM=noreply@conflictcalendar.dev

# Frontend
FRONTEND_URL=http://localhost:5173
```

#### 4. Development Workflow

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

**Development URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Mailtrap inbox: https://mailtrap.io/inboxes

### IDE Configuration

#### VS Code Setup

Recommended extensions:
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json"
  ]
}
```

#### Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "eslint.validate": ["javascript", "typescript", "javascriptreact", "typescriptreact"]
}
```

## Testing Environment

### Test Database Setup

Create a separate test database:

```bash
# Test Environment Variables (.env.test)
NODE_ENV=test
MONGO_URI=mongodb://localhost:27017/conflictcalendar_test
JWT_SECRET=test_jwt_secret
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=test-user
EMAIL_PASS=test-pass
EMAIL_FROM=test@conflictcalendar.dev
FRONTEND_URL=http://localhost:3000
```

### Running Tests

```bash
# Run backend tests
npm test

# Run frontend tests
cd frontend
npm test

# Run tests with coverage
npm run test:coverage
```

## Staging Environment

### Staging Configuration

Create `.env.staging`:

```bash
NODE_ENV=staging
MONGO_URI=mongodb+srv://staging-user:pass@staging-cluster.mongodb.net/conflictcalendar
JWT_SECRET=staging_jwt_secret_different_from_prod
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=staging@yourdomain.com
EMAIL_PASS=staging-app-password
EMAIL_FROM=staging@yourdomain.com
FRONTEND_URL=https://staging.conflictcalendar.com
```

### Staging Deployment

```bash
# Build for staging
npm run build

# Deploy to staging server
npm run deploy:staging
```

## Production Environment

### Production Configuration

Create `.env.production`:

```bash
NODE_ENV=production
MONGO_URI=mongodb+srv://prod-user:secure-pass@prod-cluster.mongodb.net/conflictcalendar
JWT_SECRET=very_secure_production_jwt_secret_32chars_minimum
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=production-app-password
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=https://conflictcalendar.com
```

### Production Deployment

```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

## Docker Environment (Optional)

### Docker Compose Setup

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: conflictcalendar

  backend:
    build: .
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - MONGO_URI=mongodb://mongodb:27017/conflictcalendar
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  mongodb_data:
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild services
docker-compose up --build
```

## Environment Variables Reference

### Required Variables

| Variable       | Development    | Staging        | Production  |
| -------------- | -------------- | -------------- | ----------- |
| `MONGO_URI`    | Local/Atlas    | Atlas          | Atlas       |
| `JWT_SECRET`   | Simple         | Secure         | Very Secure |
| `EMAIL_*`      | Mailtrap       | Gmail          | Gmail       |
| `FRONTEND_URL` | localhost:5173 | staging.domain | domain.com  |

### Security Considerations

**Development:**
- Use simple secrets for convenience
- Mailtrap for email testing
- Local MongoDB acceptable

**Staging:**
- Mirror production setup
- Use separate database
- Test email delivery

**Production:**
- Strong, unique secrets
- Production email service
- Secure database with authentication
- HTTPS only

## Troubleshooting

### Common Environment Issues

**MongoDB Connection Failed**
```bash
# Check MongoDB service
sudo systemctl status mongod

# Check connection string
echo $MONGO_URI
```

**Port Already in Use**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Use different port
export PORT=5001
```

**Email Not Working**
```bash
# Test email configuration
node -e "console.log(process.env.EMAIL_HOST)"

# Check Mailtrap inbox
# Check Gmail app password
```

**Environment Variables Not Loading**
```bash
# Check .env file exists
ls -la .env

# Verify dotenv is loading
node -e "require('dotenv').config(); console.log(process.env.NODE_ENV)"
```

---

Next: [User Guide - Authentication](user-guide/authentication)
