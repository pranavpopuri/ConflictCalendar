@echo off
echo Testing Email Configuration with Ethereal Email...
echo This will work without any account setup!
echo.

set /p EMAIL="Enter any test email address: "

echo Testing email to: %EMAIL%
echo.

curl -X POST http://localhost:5000/api/auth/test-email ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"%EMAIL%\"}"

echo.
echo.
echo Check your server console for a preview URL like:
echo 📧 Preview email at: https://ethereal.email/message/[message-id]
echo.
echo Click that URL to see your email!
pause
