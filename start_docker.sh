docker-compose up --build&
sleep 5
export MINIO_ROOT_USER="admin"
export MINIO_ROOT_PASSWORD="password"
mc config host add myminio http://localhost:9000 admin password
mc cp ./imgs/blank_profile_picture.png myminio/users
cleanup() {
  docker-compose down
}

# Register the cleanup function to be executed on script exit
trap cleanup EXIT
echo "Press Ctrl+C to stop the servers..."
wait