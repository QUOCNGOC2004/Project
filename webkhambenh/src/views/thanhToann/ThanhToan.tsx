import React, { useState, useEffect } from 'react';
import './ThanhToan.css';


const getAuthToken = (): string | null => {
  return localStorage.getItem('user_token');
};
const getUserId = (): string | null => {
  const userInfoString = localStorage.getItem('user_info');
  if (!userInfoString) {
    return null;
  }
  try {
    // Parse chuỗi JSON và lấy ra trường 'id'
    const userInfo = JSON.parse(userInfoString);
    return userInfo.id || null;
  } catch (e) {
    console.error("Không thể parse user_info từ localStorage:", e);
    return null;
  }
};

// --- Định nghĩa kiểu dữ liệu ---
interface Service {
  name: string;
  price: number;
}

interface ApiAppointment {
  appointment_id: number;
  user_id: number;
  ngay_dat_lich: string;
  gio_dat_lich: string;
  ten_benh_nhan: string;
  trang_thai: 'chưa thanh toán' | 'đã thanh toán';
  doctor_name: string;

  invoice_code: string | null;
  total_amount: number | null;
  service_details: { benhLy: string, loiKhuyen: string, services: Service[] } | null;
  invoice_created_at: string | null;
}

interface Appointment {
  id: number;
  invoiceCode: string | null;
  patientName: string;
  doctorName: string;
  date: string;
  status: 'chưa thanh toán' | 'đã thanh toán';
  services: Service[] | null;
  totalAmount: number | null;
  transactionId?: string;
  paymentDate?: string;
  invoiceCreatedAt: string | null;
}

// --- Component con (Xem khi đã thanh toán thành công) ---
const PaymentSuccessView: React.FC<{ appointment: Appointment }> = ({ appointment }) => (
  <div className="payment-success">
    <div className="icon">✅</div>
    <h3>Thanh Toán Thành Công!</h3>
    <p>
      Cảm ơn bạn đã hoàn tất thanh toán cho lịch hẹn ngày {appointment.date}.
    </p>
    <div className="transaction-id">
      Mã giao dịch: <strong>{appointment.invoiceCode}</strong>
    </div>
    {/* <p>Thanh toán vào lúc: {appointment.paymentDate}</p> */}
    <button className="btn btn-success" style={{ marginTop: '1rem' }}>
      Tải Hóa Đơn PDF
    </button>
  </div>
);

// --- Component con (Hướng dẫn chuyển khoản) ---
const BankTransferDetails: React.FC<{
  appointment: Appointment;
  formatCurrency: (amount: number) => string;
}> = ({ appointment, formatCurrency }) => {


  const services = appointment.services || [];
  const totalAmount = appointment.totalAmount || 0;
  const invoiceCode = appointment.invoiceCode || 'LỖI_KHÔNG_CÓ_MÃ';

  const BANK_BIN = "970432"; 
  const ACCOUNT_NUMBER = "0981714085"; 
  const ACCOUNT_NAME = "Nguyen Quoc Ngoc"; 

  const encodedMemo = encodeURIComponent(invoiceCode);
  const encodedName = encodeURIComponent(ACCOUNT_NAME);

  // Mẫu template API: https://api.vietqr.io/image/<BIN>-<STK>-<TEMPLATE>.png?amount=<SOTIEN>&addInfo=<NOIDUNG>&accountName=<TENTK>
  const qrUrl = `https://api.vietqr.io/image/${BANK_BIN}-${ACCOUNT_NUMBER}-qr_only.png?amount=${totalAmount}&addInfo=${encodedMemo}&accountName=${encodedName}`;

  return (
    <>
      <div className="invoice-details">
        <h3>Chi tiết chi phí - BN: {appointment.patientName}</h3>
        {services.map((s, i) => (
          <div className="service-item" key={i}>
            <span>{s.name}</span>
            <strong>{formatCurrency(s.price)}</strong>
          </div>
        ))}
        <div className="total-amount">
          <span>Tổng cộng</span>
          <span className="amount">{formatCurrency(totalAmount)}</span>
        </div>
      </div>
      
      <div className="bank-transfer-info">
        <h4>Chi tiết hóa đơn</h4>
        <p><strong>Mã hóa đơn:</strong> {invoiceCode}</p>
        <p><><strong>Ngày tạo hóa đơn:</strong> {appointment.invoiceCreatedAt || 'N/A'}</></p>
      </div>

      <div className="bank-transfer-info">
        <h4>Thông tin phòng khám</h4>
        <p><strong>Tên phòng khám:</strong> Phòng khám Đại học Phenikaa</p>
        <p><strong>Địa chỉ:</strong> Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội</p>
        <p><strong>SĐT:</strong> 0981714085</p>
        <p><strong>Email liên hệ:</strong> phenikaa@gmail.com</p>
      </div>

      <div className="bank-transfer-info">
        <h4>Thông tin chuyển khoản</h4>
        <p><strong>Ngân hàng:</strong> VpBank</p>
        <p><strong>Chủ tài khoản:</strong> Nguyễn Quốc Ngọc</p>
        <p><strong>Số tài khoản:</strong> 0981714085</p>
      </div>

      <div className="payment-qr-code">
        <h4>Quét mã QR để thanh toán</h4>
        <p>Mở ứng dụng ngân hàng của bạn và quét mã dưới đây:</p>
        <div className="qr-image-container">
          <img src={qrUrl} alt="Mã QR thanh toán VietQR" />
        </div>
        <p style={{ fontSize: '0.9rem', color: '#555' }}>
          Số tiền (<strong>{formatCurrency(totalAmount)}</strong>) và nội dung 
          (<strong>{invoiceCode}</strong>) sẽ được tự động điền.
        </p>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '1rem', color: '#6c757d' }}>
        *Vui lòng thực hiện chuyển khoản trên ứng dụng ngân hàng của bạn. Hệ thống sẽ tự động cập nhật trạng thái sau khi nhận được thanh toán.
      </p>
    </>
  );
};

// --- Component chính ---
const ThanhToan: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.REACT_APP_API_URL;

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = getAuthToken();
      const userId = getUserId();

      if (!token || !userId) {
        setError("Vui lòng đăng nhập để xem thông tin thanh toán.");
        setIsLoading(false);
        return;
      }

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

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [API_URL]);


  const selected = appointments.find((a) => a.id === selectedAppointmentId);

  // Hiển thị danh sách bên trái
  const renderAppointmentList = () => {
    if (isLoading) {
      return <div className="placeholder">Đang tải danh sách thanh toán...</div>;
    }
    if (error) {
      return <div className="placeholder" style={{ color: 'red' }}>{error}</div>;
    }
    if (appointments.length === 0) {
      return <div className="placeholder">Bạn không có lịch hẹn nào cần thanh toán hoặc đã thanh toán.</div>;
    }

    return (
      <ul id="appointments-ul">
        {appointments.map((a) => (
          <li
            key={a.id}
            className={`appointment-item ${selectedAppointmentId === a.id ? 'active' : ''
              }`}
            onClick={() => setSelectedAppointmentId(a.id)}
          >
            <div className="appointment-price">
              {a.totalAmount !== null
                ? formatCurrency(a.totalAmount)
                : (a.status === 'chưa thanh toán' ? "Chờ Hóa Đơn" : "N/A")}
            </div>
            <div className="appointment-info">Ngày khám: {a.date}</div>
            <div className="appointment-info">Bác sĩ: {a.doctorName}</div>

            <span className={`status-badge ${a.status === 'chưa thanh toán' ? 'status-chua-thanh-toan' : 'status-da-thanh-toan'
              }`}>
              {a.status} 
            </span>
          </li>
        ))}
      </ul>
    );
  };

  // Hiển thị chi tiết bên phải
  const renderDetailsPanel = () => {
    if (!selected) {
      return (
        <div className="placeholder">
          <p>Vui lòng chọn một lịch hẹn để xem chi tiết</p>
        </div>
      );
    }

    if (selected.status === 'đã thanh toán') {
      return <PaymentSuccessView appointment={selected} />;
    }

    // Nếu 'chua-thanh-toan'
    // Kiểm tra xem đã có hóa đơn (invoiceCode và totalAmount) chưa
    if (!selected.invoiceCode || selected.totalAmount === null || !selected.services) {
      return (
        <div className="placeholder invoice-pending">
          <div className="icon">📄</div>
          <h3>Chưa có hóa đơn</h3>
          <p>Quản trị viên chưa tạo hóa đơn chi tiết cho lịch hẹn này.</p>
          <p>Vui lòng chờ hoặc liên hệ phòng khám để được hỗ trợ.</p>
        </div>
      );
    }

    // Nếu 'chua-thanh-toan' và CÓ hóa đơn
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
          {renderAppointmentList()}
        </div>

        <div className="payment-details">
          <h2>Chi tiết thanh toán</h2>
          {renderDetailsPanel()}
        </div>
      </div>
    </div>
  );
};

export default ThanhToan;