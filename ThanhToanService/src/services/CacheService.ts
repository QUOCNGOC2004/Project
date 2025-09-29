import redisClient from '../config/redis';

// Cache TTL (Time To Live) - 1 giờ
const CACHE_TTL = 3600;

// Các key prefix cho cache
const CACHE_KEYS = {
  ALL_USERS: 'all_users',
  USER: 'user'
};

// Hàm helper để xử lý cache an toàn
const safeCacheOperation = async (operation: () => Promise<any>) => {
  try {
    return await operation();
  } catch (error) {
    console.warn('Redis operation failed:', error);
    return null;
  }
};

// Lấy cache
export const getCache = async (key: string): Promise<any> => {
  const data = await safeCacheOperation(() => redisClient.get(key));
  return data ? JSON.parse(data) : null;
};

// Lưu cache
export const setCache = async (key: string, data: any): Promise<void> => {
  await safeCacheOperation(() =>
    redisClient.setex(key, CACHE_TTL, JSON.stringify(data))
  );
};

// Xóa cache
export const deleteCache = async (key: string): Promise<void> => {
  await safeCacheOperation(() => redisClient.del(key));
};

// Xóa nhiều cache
export const deleteMultipleCache = async (keys: string[]): Promise<void> => {
  await safeCacheOperation(() => redisClient.del(...keys));
};

// Cache cho danh sách người dùng
export const cacheUsers = {
  getAll: async (): Promise<any> => {
    return await getCache(CACHE_KEYS.ALL_USERS);
  },
  setAll: async (data: any): Promise<void> => {
    await setCache(CACHE_KEYS.ALL_USERS, data);
  },
  deleteAll: async (): Promise<void> => {
    await deleteCache(CACHE_KEYS.ALL_USERS);
  }
};

// Cache cho một người dùng
export const cacheUser = {
  get: async (id: string): Promise<any> => {
    return await getCache(`${CACHE_KEYS.USER}:${id}`);
  },
  set: async (id: string, data: any): Promise<void> => {
    await setCache(`${CACHE_KEYS.USER}:${id}`, data);
  },
  delete: async (id: string): Promise<void> => {
    await deleteCache(`${CACHE_KEYS.USER}:${id}`);
  }
};

// Xóa tất cả cache liên quan đến một người dùng
export const invalidateUserCache = async (id: string): Promise<void> => {
  const keysToDelete = [
    CACHE_KEYS.ALL_USERS,
    `${CACHE_KEYS.USER}:${id}`
  ];

  await deleteMultipleCache(keysToDelete);
};
