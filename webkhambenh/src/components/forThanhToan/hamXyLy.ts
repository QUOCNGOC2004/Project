export const getAuthToken = (): string | null => {
  return localStorage.getItem('user_token');
};

export const getUserId = (): string | null => {
  const userInfoString = localStorage.getItem('user_info');
  if (!userInfoString) {
    return null;
  }
  try {
    const userInfo = JSON.parse(userInfoString);
    return userInfo.id || null;
  } catch (e) {
    console.error("Không thể parse user_info từ localStorage:", e);
    return null;
  }
};

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
};