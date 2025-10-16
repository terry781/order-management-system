#!/bin/bash

echo "==================================="
echo "Order Management System Setup"
echo "==================================="
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
echo "To start the application:"
echo "  npm run dev"
echo
echo "Then open: http://localhost:3000"
echo
