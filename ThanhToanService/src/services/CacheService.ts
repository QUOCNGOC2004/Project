import redisClient from '../config/redis'; 

// Thời gian cache mặc định: 1 giờ
const CACHE_TTL = 3600;

// Định nghĩa các key prefix mới cho rõ ràng
const CACHE_KEYS = {
    USER_BANK_ACCOUNT: 'bank_account:user', // Key: bank_account:user:123
    USER_INVOICES: 'invoices:user',       // Key: invoices:user:123
};

// Hàm cơ bản để thao tác với Redis
const getCache = async (key: string): Promise<any | null> => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Lỗi khi lấy cache cho key "${key}":`, error);
        return null;
    }
};

const setCache = async (key: string, data: any): Promise<void> => {
    try {
        await redisClient.setex(key, CACHE_TTL, JSON.stringify(data));
    } catch (error) {
        console.error(`Lỗi khi đặt cache cho key "${key}":`, error);
    }
};

const deleteCache = async (key: string): Promise<void> => {
    try {
        await redisClient.del(key);
    } catch (error) {
        console.error(`Lỗi khi xóa cache cho key "${key}":`, error);
    }
};

// === Chiến lược Cache cho Bank Account ===
export const cacheUserBankAccount = {
    get: (userId: string) => getCache(`${CACHE_KEYS.USER_BANK_ACCOUNT}:${userId}`),
    set: (userId: string, data: any) => setCache(`${CACHE_KEYS.USER_BANK_ACCOUNT}:${userId}`, data),
    invalidate: (userId: string) => deleteCache(`${CACHE_KEYS.USER_BANK_ACCOUNT}:${userId}`),
};

// === Chiến lược Cache cho Invoices ===
export const cacheUserInvoices = {
    get: (userId: string) => getCache(`${CACHE_KEYS.USER_INVOICES}:${userId}`),
    set: (userId: string, data: any) => setCache(`${CACHE_KEYS.USER_INVOICES}:${userId}`, data),
    invalidate: (userId: string) => deleteCache(`${CACHE_KEYS.USER_INVOICES}:${userId}`),
};