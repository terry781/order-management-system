@echo off
echo ===================================
echo Order Management System Setup
echo ===================================
echo.

echo Setting up environment configuration...
if not exist ".env" (
    echo Creating .env file from template...
    copy ".env.example" ".env"
    echo ✅ Environment file created: .env
    echo ⚠️  Please review and customize .env file if needed
) else (
    echo ✅ Environment file already exists: .env
)
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
echo Configuration:
echo   - Environment: .env (created from .env.example)
echo   - Database: Initialized with sample data
echo   - Dependencies: Installed
echo.
echo To start the application:
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo API Documentation: http://localhost:3001/api-docs
echo OpenAPI JSON: http://localhost:3001/api-docs/openapi.json
echo.
pause
