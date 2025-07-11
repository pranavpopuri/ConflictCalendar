# Production Deployment

This guide covers deploying ConflictCalendar to production environments.

## Render.com Deployment (Recommended)

ConflictCalendar is configured for deployment on Render.com, which provides free hosting for full-stack applications.

### Prerequisites

1. **GitHub Repository**: Code must be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas**: Production database setup
4. **Gmail Account**: For production email service

### Deployment Steps

#### 1. Prepare Repository

Ensure your repository has:

```bash
# Root package.json with build script
{
  "scripts": {
    "build": "npm install && npm install --prefix frontend && npm run build --prefix frontend",
    "start": "set NODE_ENV=production && tsx backend/server.ts"
  }
}
```

#### 2. Create Render Service

1. **Connect GitHub**:
   - Login to Render.com
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**:
   - **Name**: `conflictcalendar` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (or paid for better performance)

#### 3. Environment Variables

Set the following environment variables in Render dashboard:

```bash
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/conflictcalendar

# Server
NODE_ENV=production
PORT=10000
JWT_SECRET=your_very_secure_production_jwt_secret_32_chars_min

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=your-production-email@gmail.com

# Frontend
FRONTEND_URL=https://your-render-app-name.onrender.com
```

#### 4. Deploy

1. **Trigger Deployment**:
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Monitor build logs for any errors

2. **Verify Deployment**:
   - Visit your Render app URL
   - Test authentication functionality
   - Test course creation and calendar features
   - Test password reset email

### Production Configuration

#### MongoDB Atlas Setup

1. **Create Production Cluster**:
   ```bash
   # Create new cluster for production
   # Use different cluster from development
   # Enable authentication and security
   ```

2. **Network Security**:
   ```bash
   # IP Whitelist: Add 0.0.0.0/0 for Render
   # Or use Render's static IPs if available
   ```

3. **Database User**:
   ```bash
   # Create production database user
   # Use strong password
   # Grant readWrite permissions
   ```

#### Gmail Production Setup

1. **Dedicated Email Account**:
   ```bash
   # Use dedicated email for app (e.g., noreply@yourdomain.com)
   # Enable 2-Factor Authentication
   # Generate App Password
   ```

2. **DNS Configuration** (if using custom domain):
   ```bash
   # Add SPF record: "v=spf1 include:_spf.google.com ~all"
   # Add DKIM if available
   ```

## Alternative Deployment Options

### Heroku Deployment

#### Setup

1. **Install Heroku CLI**:
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**:
   ```bash
   heroku create your-app-name
   ```

3. **Configure Environment**:
   ```bash
   heroku config:set MONGO_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   heroku config:set EMAIL_HOST=smtp.gmail.com
   # ... other environment variables
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

#### Heroku Configuration

Create `Procfile`:
```
web: npm start
```

Update `package.json`:
```json
{
  "engines": {
    "node": "18.x",
    "npm": "8.x"
  }
}
```

### Vercel Deployment

#### Frontend-Only Deployment

For frontend-only deployment (requires separate backend):

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Configure vercel.json**:
   ```json
   {
     "builds": [
       {
         "src": "frontend/package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ]
   }
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### DigitalOcean App Platform

#### Setup

1. **Connect Repository**:
   - Login to DigitalOcean
   - Create new App
   - Connect GitHub repository

2. **Configure App**:
   ```yaml
   name: conflictcalendar
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/ConflictCalendar
       branch: main
     run_command: npm start
     build_command: npm run build
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: MONGO_URI
       value: your-mongodb-uri
       type: SECRET
     ```

## Production Monitoring

### Health Checks

Add health check endpoint:

```typescript
// backend/server.ts
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Logging

Implement production logging:

```typescript
// Enhanced logging for production
const log = (level: string, message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`, data || '');
};

// Usage
log('info', 'Server started', { port: PORT });
log('error', 'Database connection failed', error);
```

### Error Monitoring

Consider integrating error monitoring services:

- **Sentry**: Real-time error tracking
- **LogRocket**: Session replay and monitoring
- **Datadog**: Application performance monitoring

## Performance Optimization

### Frontend Optimization

```typescript
// vite.config.ts - Production optimizations
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          calendar: ['react-big-calendar']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### Backend Optimization

```typescript
// Express optimizations
app.use(compression()); // gzip compression
app.use(helmet()); // Security headers

// Database connection pooling
mongoose.connect(MONGO_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

## Security Considerations

### HTTPS Configuration

Render automatically provides HTTPS, but for custom domains:

```bash
# Custom domain setup
1. Add custom domain in Render dashboard
2. Update DNS CNAME record
3. SSL certificate automatically provisioned
```

### Environment Security

```bash
# Production security checklist
✅ Strong JWT secret (minimum 32 characters)
✅ Secure MongoDB credentials
✅ Gmail app password (not regular password)
✅ Environment variables not in code
✅ HTTPS only (no HTTP)
✅ CORS configured for production domain
```

### Database Security

```bash
# MongoDB Atlas security
✅ Authentication enabled
✅ IP whitelist configured
✅ Strong database user password
✅ Network encryption enabled
✅ Audit logging enabled (paid tiers)
```

## Backup and Recovery

### Database Backup

```bash
# MongoDB Atlas automatic backups
# Available on paid tiers
# Daily snapshots with point-in-time recovery

# Manual backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/conflictcalendar"
```

### Application Backup

```bash
# Code backup via GitHub
git push origin main

# Environment variables backup
# Store securely (password manager, encrypted file)
```

## Troubleshooting Production Issues

### Common Deployment Issues

| Issue                     | Cause                 | Solution                                |
| ------------------------- | --------------------- | --------------------------------------- |
| Build fails               | Missing dependencies  | Check package.json and npm install      |
| App crashes on start      | Environment variables | Verify all required env vars are set    |
| Database connection fails | MONGO_URI incorrect   | Check connection string and credentials |
| Email not sending         | Email credentials     | Verify Gmail app password and settings  |
| 404 on refresh            | SPA routing           | Ensure static files serve index.html    |

### Debugging Steps

1. **Check Build Logs**:
   ```bash
   # Render build logs show compilation errors
   # Look for missing dependencies or TypeScript errors
   ```

2. **Check Runtime Logs**:
   ```bash
   # Render runtime logs show server errors
   # Look for database connection or email service errors
   ```

3. **Test API Endpoints**:
   ```bash
   curl https://your-app.onrender.com/health
   curl https://your-app.onrender.com/api/auth/login
   ```

4. **Verify Environment Variables**:
   ```bash
   # Check Render dashboard environment variables
   # Ensure no typos or missing values
   ```

---

Next: [Configuration Guide](../configuration)
