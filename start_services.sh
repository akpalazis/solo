#!/bin/bash

# Start PostgreSQL with Homebrew
brew services start postgresql@14 &
sleep 5
# Start MinIO
export MINIO_ROOT_USER="admin"
export MINIO_ROOT_PASSWORD="password"
minio server --address 0.0.0.0:9001 ./minio/data &
sleep 5
mc config host add myminio http://localhost:9001 admin password
mc cp ./imgs/blank_profile_picture.png myminio/users
sleep 5
/Users/Palazis/PycharmProjects/solo/venv/bin/python /Users/Palazis/PycharmProjects/solo/backend/app.py
sleep 5
npm --prefix ./frontend/ run dev &

cleanup() {
  # Stop PostgreSQL
  brew services stop postgresql@14

  # Stop MinIO
  pkill -f "minio server"
}

# Register the cleanup function to be executed on script exit
trap cleanup EXIT

# Keep the script running
echo "Press Ctrl+C to stop the servers..."
wait
