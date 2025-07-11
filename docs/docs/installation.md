# Installation

Quick setup guide for ConflictCalendar development.

## Prerequisites

- Node.js 18+
- npm
- MongoDB (local or Atlas)

## Setup

### 1. Clone and Install
```bash
git clone https://github.com/pranavpopuri/ConflictCalendar.git
cd ConflictCalendar
npm install
cd frontend && npm install
```

### 2. Environment Variables
Create `.env` in the backend directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_HOST=your_smtp_host
EMAIL_PORT=587
EMAIL_USER=your_email_username
EMAIL_PASS=your_email_password
EMAIL_FROM=your_sender_email
```

### 3. Run Development
```bash
# Start backend (port 5000)
npm run dev

# Start frontend (port 5173) - in new terminal
npm run dev:client
```

### 4. Build for Production
```bash
npm run build
npm start
```

## Project Structure

```
backend/
├── controllers/     # Route handlers
├── models/         # MongoDB schemas
├── routes/         # API route definitions
├── middleware/     # Auth and validation
├── services/       # Email and external services
├── config/         # Database configuration
└── server.ts       # Express app setup

frontend/
├── src/
│   ├── components/ # React components
│   ├── pages/      # Page components
│   ├── store/      # Zustand state management
│   └── lib/        # Utilities and helpers
├── public/         # Static assets
└── dist/           # Built files (after npm run build)
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Ethereal Email Configuration (for testing)
# EMAIL_HOST=smtp.ethereal.email
# EMAIL_PORT=587
# EMAIL_USER=auto-generated-user
# EMAIL_PASS=auto-generated-password
# EMAIL_FROM=noreply@conflictcalendar.com

# Frontend URL for reset links
FRONTEND_URL=http://localhost:5173
```

### 4. Database Setup

#### Option A: Local MongoDB

1. Install MongoDB Community Edition
2. Start the MongoDB service
3. The application will automatically connect using the `MONGO_URI`

#### Option B: MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and update `MONGO_URI` in `.env`
4. Whitelist your IP address in Atlas security settings

### 5. Email Provider Setup

#### Gmail Setup (Production)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the app password in `EMAIL_PASS`

#### Ethereal Email Setup (Development/Testing)

ConflictCalendar's email service automatically configures Ethereal Email for testing when Gmail credentials are not provided. Ethereal is a fake SMTP service that captures emails without sending them.

### 6. Start Development Servers

```bash
# Start the backend server (runs on http://localhost:5000)
npm run dev

# In a new terminal, start the frontend (runs on http://localhost:5173)
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Production Setup

### Environment Variables for Production

Update your `.env` file with production values:

```bash
MONGO_URI=your-production-mongodb-uri
JWT_SECRET=a-very-secure-production-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-production-app-password
EMAIL_FROM=your-production-email@gmail.com
FRONTEND_URL=https://your-domain.com
```

### Build for Production

```bash
# Build the frontend
npm run build
```

### Start Production Server

```bash
npm start
```

## Verification

After setup, verify everything is working:

1. **Backend Health Check**: Visit http://localhost:5000/api/health
2. **Frontend Access**: Visit http://localhost:5173
3. **Database Connection**: Check console logs for successful MongoDB connection
4. **Email Service**: Try the password reset feature

## Troubleshooting

### Common Issues

#### MongoDB Connection Error
- Verify `MONGO_URI` is correct
- Check if MongoDB service is running (local setup)
- Verify IP whitelist and credentials (Atlas setup)

#### Email Not Sending
- Verify email credentials in `.env`
- Check if 2FA and app password are set up (Gmail)
- Review email service logs in console

#### Frontend Build Errors
- Clear node_modules: `rm -rf node_modules package-lock.json`
- Reinstall dependencies: `npm install`
- Check Node.js version compatibility

#### Port Already in Use
- Change `PORT` in `.env`
- Kill existing processes: `lsof -ti:5000 | xargs kill -9`

### Getting Help

If you encounter issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check the [GitHub Issues](https://github.com/hipranav7/ConflictCalendar/issues) for similar problems

---

Next: [Configuration Guide](configuration)
