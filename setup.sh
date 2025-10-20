#!/bin/bash

echo "==================================="
echo "Order Management System Setup"
echo "==================================="
echo

echo "Setting up environment configuration..."
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp ".env.example" ".env"
    echo "✅ Environment file created: .env"
    echo "⚠️  Please review and customize .env file if needed"
else
    echo "✅ Environment file already exists: .env"
fi
echo

echo "Installing dependencies..."
npm run install:all
if [ $? -ne 0 ]; then
    echo "Failed to install dependencies"
    exit 1
fi

echo
echo "Initializing database..."
npm run db:init
if [ $? -ne 0 ]; then
    echo "Failed to initialize database"
    exit 1
fi

echo
echo "==================================="
echo "Setup completed successfully!"
echo "==================================="
echo
echo "Configuration:"
echo "  - Environment: .env (created from .env.example)"
echo "  - Database: Initialized with sample data"
echo "  - Dependencies: Installed"
echo
echo "To start the application:"
echo "  npm run dev"
echo
echo "Then open: http://localhost:3000"
echo
echo "API Documentation: http://localhost:3001/api-docs"
echo "OpenAPI JSON: http://localhost:3001/api-docs/openapi.json"
echo
