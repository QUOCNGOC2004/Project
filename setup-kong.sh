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

# Cài đặt JWT plugin
curl -i -X POST http://kong:8001/plugins \
  --data name=jwt

# Áp dụng cấu hình từ file kong.yml
curl -i -X POST http://kong:8001/config \
  -H "Content-Type: application/json" \
  -d @/kong.yml

echo "Kong configuration completed!" 