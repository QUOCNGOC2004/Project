#!/bin/bash

# Đợi Kong khởi động
echo "Waiting for Kong to start..."
sleep 30

# Cấu hình Kong services và routes
echo "Configuring Kong..."
curl -i -X POST http://localhost:8001/services \
  --data name=auth-service \
  --data url=http://auth-service:3001

curl -i -X POST http://localhost:8001/services/auth-service/routes \
  --data paths[]=/auth \
  --data strip_path=true

curl -i -X POST http://localhost:8001/services \
  --data name=doctor-service \
  --data url=http://doctor-service:3002

curl -i -X POST http://localhost:8001/services/doctor-service/routes \
  --data paths[]=/doctors \
  --data strip_path=true

echo "Kong configuration completed!" 