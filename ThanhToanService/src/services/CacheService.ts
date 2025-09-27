import redisClient from '../config/redis';

// Cache TTL (Time To Live) - 1 giờ
const CACHE_TTL = 3600;

// Các key prefix cho cache
const CACHE_KEYS = {
  ALL_APPOINTMENTS: 'all_appointments',
  APPOINTMENT: 'appointment',
  USER_APPOINTMENTS: 'user_appointments'
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

// Cache cho danh sách lịch hẹn
export const cacheAppointments = {
  getAll: async (): Promise<any> => {
    return await getCache(CACHE_KEYS.ALL_APPOINTMENTS);
  },
  setAll: async (data: any): Promise<void> => {
    await setCache(CACHE_KEYS.ALL_APPOINTMENTS, data);
  },
  deleteAll: async (): Promise<void> => {
    await deleteCache(CACHE_KEYS.ALL_APPOINTMENTS);
  }
};

// Cache cho một lịch hẹn
export const cacheAppointment = {
  get: async (id: string): Promise<any> => {
    return await getCache(`${CACHE_KEYS.APPOINTMENT}:${id}`);
  },
  set: async (id: string, data: any): Promise<void> => {
    await setCache(`${CACHE_KEYS.APPOINTMENT}:${id}`, data);
  },
  delete: async (id: string): Promise<void> => {
    await deleteCache(`${CACHE_KEYS.APPOINTMENT}:${id}`);
  }
};

// Cache cho lịch hẹn của user
export const cacheUserAppointments = {
  get: async (userId: string): Promise<any> => {
    return await getCache(`${CACHE_KEYS.USER_APPOINTMENTS}:${userId}`);
  },
  set: async (userId: string, data: any): Promise<void> => {
    await setCache(`${CACHE_KEYS.USER_APPOINTMENTS}:${userId}`, data);
  },
  delete: async (userId: string): Promise<void> => {
    await deleteCache(`${CACHE_KEYS.USER_APPOINTMENTS}:${userId}`);
  }
};

// Xóa tất cả cache liên quan đến một lịch hẹn
export const invalidateAppointmentCache = async (id: string, userId?: string): Promise<void> => {
  const keysToDelete = [
    CACHE_KEYS.ALL_APPOINTMENTS,
    `${CACHE_KEYS.APPOINTMENT}:${id}`
  ];
  
  if (userId) {
    keysToDelete.push(`${CACHE_KEYS.USER_APPOINTMENTS}:${userId}`);
  }
  
  await deleteMultipleCache(keysToDelete);
}; 