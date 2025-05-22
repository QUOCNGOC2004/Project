#!/bin/bash

# Hàm kiểm tra Kong đã sẵn sàng chưa
wait_for_kong() {
    echo "Waiting for Kong to be ready..."
    while ! curl -s http://kong:8001/status > /dev/null; do
        sleep 1
    done
    echo "Kong is ready!"
}

# Đợi Kong khởi động
wait_for_kong

# Cấu hình Kong services và routes
echo "Configuring Kong..."

# Tạo auth service
curl -i -X POST http://kong:8001/services \
  --data name=auth-service \
  --data url=http://auth-service:3001

# Tạo auth route
curl -i -X POST http://kong:8001/services/auth-service/routes \
  --data paths[]=/auth \
  --data strip_path=true

# Tạo doctor service
curl -i -X POST http://kong:8001/services \
  --data name=doctor-service \
  --data url=http://doctor-service:3002

# Tạo doctor route
curl -i -X POST http://kong:8001/services/doctor-service/routes \
  --data paths[]=/doctors \
  --data strip_path=true

echo "Kong configuration completed!" 