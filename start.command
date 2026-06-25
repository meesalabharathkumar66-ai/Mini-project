#!/bin/bash
cd "$(dirname "$0")"

echo "------------------------------------------------"
echo "🛡️  S.A.M — SECURE VAULT REFRESH"
echo "------------------------------------------------"

# Function to run in a new terminal window
run_in_new_terminal() {
    osascript -e "tell application \"Terminal\" to do script \"cd '$1' && $2\""
}

# 1. Kill any existing node/vite processes on ports 3000 and 8000
echo "Cleaning up existing sessions..."
# Kill anything on 3000 (Vite)
lsof -ti :3000 | xargs kill -9 2>/dev/null
# Kill anything on 8000 (Backend)
lsof -ti :8000 | xargs kill -9 2>/dev/null
# Kill any lingering node processes
pkill -f "node"

echo "Ports cleared. Building fresh environment..."

# 2. Start Backend
echo "Starting Backend on Port 8000..."
run_in_new_terminal "$(pwd)/server" "npm install && npm run dev"

# 3. Start Frontend
echo "Starting Frontend on Port 3000..."
run_in_new_terminal "$(pwd)/web" "npm install && npm run dev"

# 4. Open Browser
echo "Opening Secure Dashboard in 10 seconds..."
(sleep 10 && open http://localhost:3000) &

echo "------------------------------------------------"
echo "✅ BOOTSTRAP COMPLETE!"
echo "Please wait for the terminal windows to finish 'npm install'."
echo "Your changes will appear at: http://localhost:3000"
echo "------------------------------------------------"
