import React, { useState, useEffect } from 'react';
import './ThanhToan.css'; // CSS chính
import { useLocation, useHistory } from 'react-router-dom';

import { Appointment, ApiAppointment } from '../../components/forThanhToan/types';
import { getAuthToken, getUserId, formatCurrency, formatDate } from '../../components/forThanhToan/hamXyLy';
import { AppointmentList } from '../../components/forThanhToan/AppointmentList';
import { PaymentSuccessView } from '../../components/forThanhToan/PaymentSuccessView';
import { BankTransferDetails } from '../../components/forThanhToan/BankTransferDetails';
import { Placeholder } from '../../components/forThanhToan/Placeholder';
import { InvoicePendingPlaceholder } from '../../components/forThanhToan/InvoicePendingPlaceholder';

import '../../components/forThanhToan/AppointmentList.css';
import '../../components/forThanhToan/PaymentSuccessView.css';
import '../../components/forThanhToan/BankTransferDetails.css';
import '../../components/forThanhToan/Placeholder.css';
import '../../components/forThanhToan/InvoicePendingPlaceholder.css';


const ThanhToan: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.REACT_APP_API_URL;

  const location = useLocation<{ selectId?: number }>();
  const history = useHistory();

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = getAuthToken();
      const userId = getUserId();

      if (!token || !userId) {
        setError("Vui lòng đăng nhập để xem thông tin thanh toán.");
        setIsLoading(false);
        return;
      }
      
      setError(null);
      setIsLoading(true);

      try {
        const response = await fetch(`${API_URL}/appointments/user/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Không thể tải danh sách lịch hẹn.');
        }

        const data: ApiAppointment[] = await response.json();

        const filteredAndMappedData: Appointment[] = data
          .filter(a => a.trang_thai === 'chưa thanh toán' || a.trang_thai === 'đã thanh toán')
          .map(a => ({
            id: a.appointment_id,
            invoiceCode: a.invoice_code,
            patientName: a.ten_benh_nhan,
            doctorName: a.doctor_name,
            date: formatDate(a.ngay_dat_lich),
            status: a.trang_thai,
            services: a.service_details?.services || null,
            totalAmount: a.total_amount || null,
            transactionId: a.trang_thai === 'đã thanh toán' ? a.invoice_code! : undefined,
            invoiceCreatedAt: a.invoice_created_at ? formatDate(a.invoice_created_at) : null 
          }));
        
        setAppointments(filteredAndMappedData);

        if (location.state && location.state.selectId) {
          const idToSelect = location.state.selectId;
          const foundInList = filteredAndMappedData.find(a => a.id === idToSelect);
          
          if (foundInList) {
            setSelectedAppointmentId(idToSelect);
          }
          history.replace({ ...history.location, state: undefined });
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();

    const handleLogout = () => {
      setAppointments([]); 
      setError('Vui lòng đăng nhập để xem thông tin thanh toán.'); 
      setIsLoading(false); 
      setSelectedAppointmentId(null); 
    };

    document.addEventListener('loginStatusChanged', handleLogout);

    return () => {
      document.removeEventListener('loginStatusChanged', handleLogout);
    };

  }, [API_URL, history, location.state]); 


  const selected = appointments.find((a) => a.id === selectedAppointmentId);

  // Hiển thị chi tiết bên phải
  const renderDetailsPanel = () => {
    if (!selected) {
      return (
        <Placeholder>
          <p>Vui lòng chọn một lịch hẹn để xem chi tiết</p>
        </Placeholder>
      );
    }

    if (selected.status === 'đã thanh toán') {
      return <PaymentSuccessView appointment={selected} />;
    }

    if (!selected.invoiceCode || selected.totalAmount === null || !selected.services) {
      return <InvoicePendingPlaceholder />;
    }

    return (
      <BankTransferDetails
        appointment={selected}
        formatCurrency={formatCurrency}
      />
    );
  };

  return (
    <div className="payment-page-wrapper">
      <div className="payment-container">
        <div className="appointment-list">
          <h2>Danh sách thanh toán</h2>
          <AppointmentList
            appointments={appointments}
            selectedAppointmentId={selectedAppointmentId}
            onSelect={setSelectedAppointmentId}
            formatCurrency={formatCurrency}
            isLoading={isLoading}
            error={error}
          />
        </div>

        <div className="payment-details">
          <h2>Chi tiết thanh toán</h2>
          <div id="details-content">
            {renderDetailsPanel()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThanhToan;