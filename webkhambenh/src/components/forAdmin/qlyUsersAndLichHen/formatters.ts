
export const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5);
};