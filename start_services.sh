#!/bin/bash

# Start PostgreSQL with Homebrew
brew services start postgresql@14

# Start MinIO
export MINIO_ROOT_USER="admin"
export MINIO_ROOT_PASSWORD="password"
minio server --address 0.0.0.0:9001 ./minio/data

cleanup() {
  # Stop PostgreSQL
  brew services stop postgresql@14
}

# Register the cleanup function to be executed on script exit
trap cleanup EXIT

# Keep the script running
echo "Press Ctrl+C to stop the servers..."
while true; do
  sleep 1
done