#!/bin/bash

echo "Building and testing production setup..."

# Navigate to project root
cd "c:/Users/hipra/Documents/GitHub/ConflictCalendar"

# Clean and rebuild
echo "Cleaning old build..."
rm -rf frontend/dist

echo "Installing dependencies..."
npm install
cd frontend && npm install && cd ..

echo "Building frontend..."
cd frontend && npm run build && cd ..

echo "Starting production server..."
npm run start
