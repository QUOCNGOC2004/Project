import redisClient from '../config/redis';

// Cache TTL (Time To Live) - 1 giờ
const CACHE_TTL = 3600;

// Các key prefix cho cache
const CACHE_KEYS = {
  ALL_DOCTORS: 'all_doctors',
  DOCTOR: 'doctor',
  DOCTOR_SPECIALTY: 'doctor_specialty'
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

// Cache cho danh sách bác sĩ
export const cacheDoctors = {
  getAll: async (): Promise<any> => {
    return await getCache(CACHE_KEYS.ALL_DOCTORS);
  },
  setAll: async (data: any): Promise<void> => {
    await setCache(CACHE_KEYS.ALL_DOCTORS, data);
  },
  deleteAll: async (): Promise<void> => {
    await deleteCache(CACHE_KEYS.ALL_DOCTORS);
  }
};

// Cache cho một bác sĩ
export const cacheDoctor = {
  get: async (id: string): Promise<any> => {
    return await getCache(`${CACHE_KEYS.DOCTOR}:${id}`);
  },
  set: async (id: string, data: any): Promise<void> => {
    await setCache(`${CACHE_KEYS.DOCTOR}:${id}`, data);
  },
  delete: async (id: string): Promise<void> => {
    await deleteCache(`${CACHE_KEYS.DOCTOR}:${id}`);
  }
};

// Cache cho bác sĩ theo chuyên khoa
export const cacheDoctorSpecialty = {
  get: async (specialty: string): Promise<any> => {
    return await getCache(`${CACHE_KEYS.DOCTOR_SPECIALTY}:${specialty}`);
  },
  set: async (specialty: string, data: any): Promise<void> => {
    await setCache(`${CACHE_KEYS.DOCTOR_SPECIALTY}:${specialty}`, data);
  },
  delete: async (specialty: string): Promise<void> => {
    await deleteCache(`${CACHE_KEYS.DOCTOR_SPECIALTY}:${specialty}`);
  }
};

// Xóa tất cả cache liên quan đến một bác sĩ
export const invalidateDoctorCache = async (id: string, specialty?: string): Promise<void> => {
  const keysToDelete = [
    CACHE_KEYS.ALL_DOCTORS,
    `${CACHE_KEYS.DOCTOR}:${id}`
  ];
  
  if (specialty) {
    keysToDelete.push(`${CACHE_KEYS.DOCTOR_SPECIALTY}:${specialty}`);
  }
  
  await deleteMultipleCache(keysToDelete);
}; 