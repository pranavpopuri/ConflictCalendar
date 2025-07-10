@echo off
echo Building and testing production setup...

cd /d "c:\Users\hipra\Documents\GitHub\ConflictCalendar"

echo Cleaning old build...
if exist frontend\dist rmdir /s /q frontend\dist

echo Installing backend dependencies...
call npm install

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo Building frontend...
cd frontend
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Frontend build failed!
    pause
    exit /b 1
)
cd ..

echo Frontend build complete. Contents of dist folder:
dir frontend\dist

echo.
echo Starting production server...
echo Open http://localhost:5000 in your browser
echo Press Ctrl+C to stop the server
echo.
call npm run start
