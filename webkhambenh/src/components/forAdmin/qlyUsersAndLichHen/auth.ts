
export const getAuthToken = (): string | null => {
    return localStorage.getItem('admin_token'); 
};