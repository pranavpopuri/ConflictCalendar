# Render Environment Variables Setup Guide

## 🚀 To configure environment variables on Render:

1. **Go to your Render dashboard** (https://dashboard.render.com)
2. **Select your service** (conflictcalendar)
3. **Go to the "Environment" tab**
4. **Add these environment variables:**

```
NODE_ENV=production
MONGO_URI=mongodb+srv://hipranav7:sYbgdbeS217HXkUi@pranav-cluster.aq3zrvv.mongodb.net/courses?retryWrites=true&w=majority&appName=pranav-cluster
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=hipranav7@gmail.com
EMAIL_PASS=gymvstoquxrqljuj
EMAIL_FROM=hipranav7@gmail.com
FRONTEND_URL=https://conflictcalendar.onrender.com
```

## 🔧 Important Notes:

- **Never commit .env files to git** - they contain sensitive information
- **Use Render's environment variables** for production
- **Keep .env.development for local development only**
- **The FRONTEND_URL must match your actual deployed domain**

## 🔄 After making changes:

1. **Save the environment variables** in Render
2. **Redeploy your service** (Render will do this automatically)
3. **Test password reset** to ensure emails have correct links

## ✅ Verification:

Test the password reset flow:
1. Request password reset from your deployed app
2. Check that the email contains: `https://conflictcalendar.onrender.com/reset-password?token=...`
3. Click the link to ensure it works

The reset links will now work correctly in both development and production!
