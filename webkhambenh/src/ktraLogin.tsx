import axios from 'axios';

interface User {
    id: number;
    username: string;
    email: string;
    
}

/**
 * Kiểm tra xem người dùng đã đăng nhập hay chưa
 * @returns boolean
 */
export const isLoggedIn = (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
};

/**
 * Lấy thông tin người dùng hiện tại
 * @returns User | null
 */
export const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};

/**
 * Lấy token xác thực
 * @returns string | null
 */
export const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
};




export const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Dispatch event để cập nhật UI
    const event = new CustomEvent('loginStatusChanged', {
        detail: {
            isLoggedIn: false,
            username: null
        }
    });
    document.dispatchEvent(event);
};
