@echo off
echo Starting server...
echo.

start /B npm start

echo Waiting for server to start...
timeout /t 5 /nobreak > nul

echo.
echo Testing routes...
echo.

echo Testing root route:
curl -s http://localhost:5000/ | findstr "<!doctype html" && echo "✅ Root route works" || echo "❌ Root route failed"

echo.
echo Testing reset-password route:
curl -s http://localhost:5000/reset-password | findstr "<!doctype html" && echo "✅ Reset password route works" || echo "❌ Reset password route failed"

echo.
echo Testing API route:
curl -s http://localhost:5000/api/auth/test-email -X POST -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\"}" | findstr "message\|error" && echo "✅ API route works" || echo "❌ API route failed"

echo.
echo Test complete. Check results above.
echo.
echo Press any key to stop server...
pause > nul

echo Stopping server...
taskkill /F /IM node.exe > nul 2>&1
taskkill /F /IM tsx.exe > nul 2>&1
echo Server stopped.
