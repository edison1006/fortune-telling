#!/bin/bash
# Simple script to start the backend server

echo "Starting Fortune Telling Backend Server..."
echo "Make sure you have installed dependencies: pip install -r requirements.txt"
echo ""

# Check that we are in the correct directory
if [ ! -f "main.py" ]; then
    echo "Error: Please run this script from the backend directory"
    exit 1
fi

# Set default port if not provided
PORT=${PORT:-8000}

# Start the server
echo "Starting server on http://127.0.0.1:${PORT}"
echo "API docs available at http://127.0.0.1:${PORT}/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn main:app --reload --host 127.0.0.1 --port ${PORT}



