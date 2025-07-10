# Gmail Setup Guide for Conflict Calendar

## 📧 Setting up Gmail for Email Sending

### Step 1: Enable 2-Factor Authentication
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", click **2-Step Verification**
4. Follow the setup process if not already enabled

### Step 2: Generate App Password
1. In Google Account settings, go to **Security**
2. Under "Signing in to Google", click **2-Step Verification**
3. Scroll down and click **App passwords**
4. Select **Mail** for the app
5. Select **Other (Custom name)** for device
6. Enter "Conflict Calendar" as the name
7. Click **Generate**
8. **Copy the 16-character app password** (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update Your .env File
Replace `your_gmail_app_password_here` in your .env file with the app password:

```env
EMAIL_USER=hipranav7@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # Your actual app password (remove spaces)
EMAIL_FROM=hipranav7@gmail.com
```

**Important**: Remove all spaces from the app password!

### Step 4: Test the Configuration
1. Start your server: `npm run start`
2. Run the email test: `.\test-email.bat`
3. Enter your email address when prompted
4. Check your Gmail inbox for the test email

## 🔧 Troubleshooting

### "Username and Password not accepted"
- Make sure 2FA is enabled on your Google account
- Use the app password, not your regular Gmail password
- Remove all spaces from the app password

### "Less secure app access"
- This is not needed if you use app passwords
- App passwords are the secure, recommended method

### Still not working?
1. Try port 465 with secure: true:
   ```env
   EMAIL_PORT=465
   ```
   Update the email service to use `secure: true` for port 465

2. Check if your network/firewall blocks SMTP
3. Verify the app password is correct (regenerate if needed)

## 🚀 Production Considerations

For production, consider using:
- **SendGrid** - More reliable for high volume
- **Mailgun** - Good developer experience
- **Amazon SES** - Cost-effective for AWS users
- **Postmark** - Excellent deliverability

Gmail has daily sending limits:
- Free accounts: ~100-500 emails/day
- Google Workspace: ~2000 emails/day

## 📝 Notes
- App passwords are specific to your account and this application
- If you change your Google password, app passwords remain valid
- You can revoke app passwords anytime from your Google Account settings
- Gmail automatically handles SPF, DKIM, and DMARC for better deliverability
