@echo off
echo ============================================
echo   🐛 DEBUG: Email Issue Troubleshooting
echo ============================================
echo.

echo Step 1: Testing if server is running...
echo.
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/me' -Method GET -ErrorAction Stop; Write-Host '✅ Server is running' } catch { Write-Host '❌ Server is not running or not responding' }"
echo.

echo Step 2: Testing email endpoint...
echo.
set /p EMAIL="Enter any test email address: "

echo Testing with email: %EMAIL%
echo.

powershell -Command "$body = @{ email = '%EMAIL%' } | ConvertTo-Json; try { $response = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/test-email' -Method POST -Body $body -ContentType 'application/json' -ErrorAction Stop; Write-Host '✅ Request successful:'; Write-Host $response.Content } catch { Write-Host '❌ Request failed:'; Write-Host $_.Exception.Message }"

echo.
echo ============================================
echo Step 3: Check your server console NOW!
echo You should see detailed logs like:
echo   📧 EmailService constructor called
echo   🔧 Initializing email service...
echo   🧪 Creating Ethereal Email test account...
echo   ✅ Ethereal Email account created
echo   🧪 Test email endpoint called
echo   📤 sendEmail called with...
echo   🌐 Preview email at: [URL]
echo.
echo If you don't see these logs, the server might not be started
echo or there might be an import/loading issue.
echo ============================================
pause
