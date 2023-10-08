brew services start postgresql@14
sleep 5
dropdb -p 5433 db
sleep 5
createdb -p 5433 db
sleep 5
rm -rf ./minio
sleep 5
brew services stop postgresql@14
