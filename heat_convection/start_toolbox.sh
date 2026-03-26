#!/bin/bash

# MecaToolbox Startup Script
echo "Launching MecaToolbox (Heat Convection Module)..."

# Start FastAPI backend in the background
# Using python3 -m uvicorn as it's the safest way to ensure environment consistency
python3 -m uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Start Vite frontend
echo "Starting Frontend dashboard..."
cd frontend
npm run dev

# Cleanup background processes on exit
trap "kill $BACKEND_PID" EXIT
