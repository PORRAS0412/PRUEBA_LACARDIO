docker run -d \
  --name postgres_lacardio \
  -e POSTGRES_USER=lacardio \
  -e POSTGRES_PASSWORD=lacardio123 \
  -e POSTGRES_DB=LACARDIO \
  -p 5432:5432 \
  postgres:16
