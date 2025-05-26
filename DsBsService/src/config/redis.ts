import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryStrategy: (times) => {
    // Tăng thời gian chờ giữa các lần retry
    const delay = Math.min(times * 100, 3000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableOfflineQueue: false, // Không đợi khi Redis offline
  connectTimeout: 10000, // Timeout sau 10 giây
  lazyConnect: true, // Chỉ kết nối khi cần
  reconnectOnError: (err) => {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      return true; // Chỉ reconnect khi gặp lỗi READONLY
    }
    return false;
  }
});

// Xử lý lỗi kết nối
redisClient.on('error', (err) => {
  // Chỉ log lỗi, không throw
  console.warn('Redis Client Error:', err.message);
});

// Xử lý khi kết nối thành công
redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

// Xử lý khi kết nối bị đóng
redisClient.on('close', () => {
  console.warn('Redis Client Connection Closed');
});

// Xử lý khi kết nối bị mất
redisClient.on('end', () => {
  console.warn('Redis Client Connection Ended');
});

export default redisClient; 