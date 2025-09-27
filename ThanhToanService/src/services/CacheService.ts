import redisClient from '../config/redis';

// Cache TTL (Time To Live) - 1 giờ
const CACHE_TTL = 3600;

// Các key prefix cho cache
const CACHE_KEYS = {
  ALL_THANHTOANS: 'all_thanh_toans',
  THANHTOAN: 'thanh_toan',
  USER_THANHTOANS: 'user_thanh_toans'
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

// Cache cho danh sách thanh toán
export const cacheThanhToans = {
  getAll: async (): Promise<any> => {
    return await getCache(CACHE_KEYS.ALL_THANHTOANS);
  },
  setAll: async (data: any): Promise<void> => {
    await setCache(CACHE_KEYS.ALL_THANHTOANS, data);
  },
  deleteAll: async (): Promise<void> => {
    await deleteCache(CACHE_KEYS.ALL_THANHTOANS);
  }
};

// Cache cho một thanh toán
export const cacheThanhToan = {
  get: async (id: string): Promise<any> => {
    return await getCache(`${CACHE_KEYS.THANHTOAN}:${id}`);
  },
  set: async (id: string, data: any): Promise<void> => {
    await setCache(`${CACHE_KEYS.THANHTOAN}:${id}`, data);
  },
  delete: async (id: string): Promise<void> => {
    await deleteCache(`${CACHE_KEYS.THANHTOAN}:${id}`);
  }
};

// Cache cho thanh toán của user
export const cacheUserThanhToans = {
  get: async (userId: string): Promise<any> => {
    return await getCache(`${CACHE_KEYS.USER_THANHTOANS}:${userId}`);
  },
  set: async (userId: string, data: any): Promise<void> => {
    await setCache(`${CACHE_KEYS.USER_THANHTOANS}:${userId}`, data);
  },
  delete: async (userId: string): Promise<void> => {
    await deleteCache(`${CACHE_KEYS.USER_THANHTOANS}:${userId}`);
  }
};

// Xóa tất cả cache liên quan đến một thanh toán
export const invalidateThanhToanCache = async (id: string, userId?: string): Promise<void> => {
  const keysToDelete = [
    CACHE_KEYS.ALL_THANHTOANS,
    `${CACHE_KEYS.THANHTOAN}:${id}`
  ];
  
  if (userId) {
    keysToDelete.push(`${CACHE_KEYS.USER_THANHTOANS}:${userId}`);
  }
  
  await deleteMultipleCache(keysToDelete);
};