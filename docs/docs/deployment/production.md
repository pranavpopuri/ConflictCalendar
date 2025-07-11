# Production Deployment

This guide covers deploying ConflictCalendar to production on Render.com.

## Render.com Deployment

ConflictCalendar is configured for deployment on Render.com, which provides free hosting for full-stack applications.

### Prerequisites

1. **GitHub Repository**: Code must be in a GitHub repository
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas**: Production database setup
4. **Gmail Account**: For production email service

### Deployment Steps

#### 1. Prepare Repository

Ensure your repository has the correct build configuration in root `package.json`:

```json
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
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/conflictcalendar
JWT_SECRET=your_very_secure_jwt_secret_at_least_32_characters
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-app-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=your-app-email@gmail.com
FRONTEND_URL=https://your-render-app-name.onrender.com
```

#### 4. Deploy

1. **Trigger Deploy**:
   - Render will automatically build and deploy
   - Monitor build logs for any errors

2. **Verify Deployment**:
   - Visit your Render app URL
   - Test user registration and login
   - Test password reset functionality

### Production Configuration

#### MongoDB Atlas Setup

1. **Network Access**:
   ```bash
   # IP Whitelist: Add 0.0.0.0/0 for Render
   # Or use Render's static IPs if available
   ```

2. **Database User**:
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

## Troubleshooting

### Common Deployment Issues

**Build Failures**
- Check build logs in Render dashboard
- Verify all dependencies are in package.json
- Ensure environment variables are set

**Database Connection Issues**
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check connection string format
- Test connection locally first

**Email Not Working**
- Verify Gmail app password is correct
- Check email environment variables
- Test email functionality locally

### Debug Commands

```bash
# Test database connection locally
node -e "
const mongoose = require('mongoose');
mongoose.connect('your-mongo-uri')
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Failed:', err));
"
```

## Security Considerations

### Environment Variables
- Use strong, unique values for production
- Never commit secrets to version control
- Rotate secrets regularly

### Database Security
- Create dedicated database user with minimal permissions
- Use strong passwords
- Whitelist only necessary IP addresses

### Application Security
- Keep dependencies updated
- Use HTTPS in production
- Validate all user inputs

## Monitoring

### Health Checks

Render automatically monitors your application health. You can also implement custom health checks:

```javascript
// Add to your Express app
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});
```

### Logs

Access logs through Render dashboard:
- Build logs for deployment issues
- Runtime logs for application errors
- System logs for infrastructure issues
