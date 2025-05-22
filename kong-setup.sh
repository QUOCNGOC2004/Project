#!/bin/bash

# Đợi Kong khởi động
echo "Đợi Kong khởi động..."
sleep 10

# Tạo service cho AuthService
curl -i -X POST http://localhost:8001/services \
  --data name=auth-service \
  --data url='http://auth-service:3001'

# Tạo route cho AuthService
curl -i -X POST http://localhost:8001/services/auth-service/routes \
  --data name=auth-route \
  --data paths[]=/api/auth \
  --data methods[]=GET \
  --data methods[]=POST \
  --data methods[]=PUT \
  --data methods[]=DELETE

# Tạo service cho DsBsService
curl -i -X POST http://localhost:8001/services \
  --data name=doctors-service \
  --data url='http://doctors-service:3002'

# Tạo route cho DsBsService
curl -i -X POST http://localhost:8001/services/doctors-service/routes \
  --data name=doctors-route \
  --data paths[]=/api/doctors \
  --data methods[]=GET \
  --data methods[]=POST \
  --data methods[]=PUT \
  --data methods[]=DELETE

# Thêm CORS plugin
curl -i -X POST http://localhost:8001/plugins \
  --data name=cors \
  --data config.origins=http://localhost:3000 \
  --data config.methods=GET,POST,PUT,DELETE,OPTIONS \
  --data config.headers=Content-Type,Authorization \
  --data config.credentials=true

echo "Cấu hình Kong hoàn tất!" 