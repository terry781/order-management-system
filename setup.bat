@echo off
echo ===================================
echo Order Management System Setup
echo ===================================
echo.

echo Installing dependencies...
call npm run install:all
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Initializing database...
call npm run db:init
if %errorlevel% neq 0 (
    echo Failed to initialize database
    pause
    exit /b 1
)

echo.
echo ===================================
echo Setup completed successfully!
echo ===================================
echo.
echo To start the application:
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
pause
