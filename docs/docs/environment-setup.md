# Environment Setup

This guide covers setting up your development environment for ConflictCalendar.

## Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**
- **Code Editor** (VS Code recommended)

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/pranavpopuri/ConflictCalendar.git
cd ConflictCalendar
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install documentation dependencies (optional)
cd docs
npm install
cd ..
```

### 3. Environment Configuration

Create `.env` file in the root directory:

```bash
# Database Configuration
MONGO_URI=mongodb://localhost:27017/conflictcalendar

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_at_least_32_characters

# Email Configuration (Gmail for production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@conflictcalendar.com

# Application URLs
FRONTEND_URL=http://localhost:5173
```

### 4. Database Setup

#### Local MongoDB

1. **Install MongoDB Community**:
   - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB Service**:
   ```bash
   # Windows
   net start MongoDB

   # macOS
   brew services start mongodb/brew/mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

#### MongoDB Atlas (Cloud)

1. **Create Account**: Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Create Cluster**: Choose free tier
3. **Setup Network Access**: Add your IP (0.0.0.0/0 for development)
4. **Create Database User**: With read/write permissions
5. **Get Connection String**: Update `.env` with Atlas URI

### 5. Email Configuration

#### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update .env file** with Gmail credentials

#### Development Email Testing

ConflictCalendar automatically uses Ethereal Email for testing when Gmail credentials aren't provided. No additional setup required for development.

## Running the Application

### Development Mode

```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

### Production Build

```bash
# Build frontend
cd frontend
npm run build
cd ..

# Start production server
npm start
```

## Development Tools

### Database Management

- **MongoDB Compass**: GUI for MongoDB
- **VS Code Extensions**: MongoDB for VS Code

### API Testing

- **Thunder Client** (VS Code extension)
- **Postman**
- **Insomnia**

## Troubleshooting

### Common Issues

**MongoDB Connection Failed**
- Verify MongoDB service is running
- Check connection string format
- Ensure database permissions are correct

**Email Not Sending**
- Verify Gmail app password (not regular password)
- Check 2-factor authentication is enabled
- Ensure EMAIL_* variables are set correctly

**Frontend Build Errors**
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify all dependencies are installed

### Environment Variables

Always verify your `.env` file contains all required variables:

```bash
# Check if all variables are set
node -e "
const required = ['MONGO_URI', 'JWT_SECRET'];
required.forEach(key => {
  if (!process.env[key]) console.error(\`Missing: \${key}\`);
});
"
```
