import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { getAuthToken,formatDate } from './hamXuLy';
import { UserDetails, BankAccount } from './index';
import './UserDetailModal.css'; 

interface UserDetailModalProps {
    userId: number;
    username: string;
    onClose: () => void;
}

const API_URL = process.env.REACT_APP_API_URL;

const UserDetailModal: React.FC<UserDetailModalProps> = ({ userId, username, onClose }) => {
    const [userDetail, setUserDetail] = useState<UserDetails | null>(null);
    const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            setAuthError("Không tìm thấy token xác thực.");
            setIsLoading(false);
            return;
        }

        const fetchUserDetails = async () => {
            try {
                const res = await fetch(`${API_URL}/auth/user/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Không thể tải thông tin người dùng');
                const data = await res.json();
                setUserDetail(data.user); 
            } catch (err) {
                setAuthError(err instanceof Error ? err.message : 'Lỗi không xác định');
            }
        };

        const fetchBankAccount = async () => {
            try {
                const res = await fetch(`${API_URL}/bank-accounts/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.status === 404) {
                    setBankAccount(null); 
                    return;
                }
                if (!res.ok) throw new Error('Không thể tải thông tin thanh toán');
                const data = await res.json(); 
                if (data.success && data.data) {
                    setBankAccount(data.data); 
                }
            } catch (err) {
                setPaymentError(err instanceof Error ? err.message : 'Lỗi không xác định');
            }
        };

        const fetchAllInfo = async () => {
            setIsLoading(true);
            setAuthError(null);
            setPaymentError(null);
            await Promise.allSettled([fetchUserDetails(), fetchBankAccount()]);
            setIsLoading(false);
        };

        fetchAllInfo();
    }, [userId]);

    const renderDetailItem = (label: string, value: string | undefined | null) => (
        <p><strong>{label}:</strong> {value || '(Chưa cập nhật)'}</p>
    );

    return (
        <Modal title={`Chi tiết người dùng: ${username}`} onClose={onClose}>
            <div className="user-detail-modal-body">
                {isLoading && <p className="user-detail-loading">Đang tải chi tiết...</p>}

                {/* Phần 1: Thông tin cá nhân (Từ Auth Service) */}
                <div className="user-detail-section">
                    <h4 className="user-detail-header">Thông tin cá nhân</h4>
                    {authError ? (
                        <p className="user-detail-error">{authError}</p>
                    ) : userDetail ? (
                        <div className="user-detail-grid">
                            {renderDetailItem("Username", userDetail.username)}
                            {renderDetailItem("Email", userDetail.email)}
                            {renderDetailItem("SĐT", userDetail.so_dien_thoai)}
                            {renderDetailItem("Giới tính", userDetail.gioi_tinh)}
                            {renderDetailItem("Ngày sinh", formatDate(userDetail.ngay_sinh))}
                        </div>
                    ) : (
                        !isLoading && <p>Không tải được thông tin cá nhân.</p>
                    )}
                </div>

                {/* Phần 2: Thông tin thanh toán (Từ Payment Service) */}
                <div className="user-detail-section">
                    <h4 className="user-detail-header">Thông tin thanh toán</h4>
                    {paymentError ? (
                        <p className="user-detail-error">{paymentError}</p>
                    ) : bankAccount ? (
                        <div className="user-detail-grid">
                            {renderDetailItem("Ngân hàng", bankAccount.bank_name)}
                            {renderDetailItem("Chủ tài khoản", bankAccount.account_holder)}
                            {renderDetailItem("Số tài khoản", bankAccount.account_number)}
                        </div>
                    ) : (
                        !isLoading && <p>Người dùng này chưa liên kết tài khoản ngân hàng.</p>
                    )}
                </div>
            </div>
            <div className="modal-actions">
                <button type="button" onClick={onClose} className="modal-button modal-button-secondary">
                    Đóng
                </button>
            </div>
        </Modal>
    );
};

export default UserDetailModal;