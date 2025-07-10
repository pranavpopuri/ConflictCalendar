# Mailtrap Setup Guide for Conflict Calendar

## What is Mailtrap?
Mailtrap is an email testing service that captures emails in a virtual inbox instead of sending them to real recipients. Perfect for development and testing!

## Step-by-Step Setup:

### 1. Create a Mailtrap Account
1. Go to [mailtrap.io](https://mailtrap.io)
2. Sign up for a free account
3. Verify your email address

### 2. Create an Inbox
1. After logging in, you'll see the Mailtrap dashboard
2. Click on "Email Testing" in the left sidebar
3. Click "Add Inbox" or use the default "My Inbox"
4. Give your inbox a name like "Conflict Calendar Dev"

### 3. Get SMTP Credentials
1. Click on your inbox name
2. Go to the "SMTP Settings" tab
3. Select "Nodemailer" from the integrations dropdown
4. Copy the credentials shown

### 4. Update Your .env File
Replace the placeholder values in your .env file with the actual Mailtrap credentials:

```
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_actual_mailtrap_username
EMAIL_PASS=your_actual_mailtrap_password
EMAIL_FROM=noreply@conflictcalendar.com
```

### 5. Test the Setup
1. Start your application: `npm run dev`
2. Try the "Forgot Password" feature
3. Check your Mailtrap inbox to see the captured email

## Mailtrap Benefits:
✅ Safe testing - no real emails sent
✅ Free tier available (100 emails/month)
✅ HTML preview and spam analysis
✅ Easy integration with Node.js
✅ No need for app passwords or 2FA setup

## Production Alternative:
For production, you can upgrade to Mailtrap's sending service or switch to:
- SendGrid
- Mailgun
- Amazon SES
- Postmark

## Troubleshooting:
- Make sure to use the exact credentials from Mailtrap
- Port 2525 is the standard Mailtrap port
- The host should be `sandbox.smtp.mailtrap.io`
- Check the Mailtrap logs if emails aren't appearing
