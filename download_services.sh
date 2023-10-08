brew services start postgresql@14
sleep 5
pg_dump -U postgres -d db -f ./backup_db/backup.sql -p 5433
sleep 5
brew services stop postgresql@14