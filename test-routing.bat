@echo off
echo Testing server routing...
echo.
echo Starting server in background...
start /B npm run dev

echo Waiting for server to start...
timeout /t 3 /nobreak > nul

echo Testing root route...
curl -s http://localhost:5000/ | findstr "html"

echo.
echo Testing reset-password route...
curl -s http://localhost:5000/reset-password | findstr "html"

echo.
echo Testing API route...
curl -s http://localhost:5000/api/auth/test-email -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\"}" | findstr "error\|success\|message"

echo.
echo Done testing.
