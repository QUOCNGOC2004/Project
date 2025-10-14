import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../views/css/DatLich.css';
import Form1 from '../../components/js/forDatLich/form1';
import Form2 from '../../components/js/forDatLich/form2';
import { isLoggedIn, getCurrentUser, logout } from '../../ktraLogin';

interface DuLieuChiTietLichHen {
  benhVien: string;
  chuyenKhoa: string;
  bacSi: string;
  bacSiId: number;
  ngayHen: string;
  gioHen: string;
}

interface DuLieuBenhNhan {
  hoTen: string;
  email: string;
  gioiTinh: string;
  ngaySinh: string;
  soDienThoai: string;
  lyDoKham: string;
  dongYDieuKhoan: boolean;
}

interface DuLieuForm extends DuLieuChiTietLichHen, DuLieuBenhNhan { }

const DatLich: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [duLieuForm, setDuLieuForm] = useState<DuLieuForm>({
    benhVien: searchParams.get('hospital') || "",
    chuyenKhoa: searchParams.get('specialty') || "",
    bacSi: searchParams.get('doctorName') || "",
    bacSiId: parseInt(searchParams.get('id') || "0"),
    ngayHen: "",
    gioHen: "",
    hoTen: "",
    email: "",
    gioiTinh: "",
    ngaySinh: "",
    soDienThoai: "",
    lyDoKham: "",
    dongYDieuKhoan: false,
  });

  useEffect(() => {
  }, []);

  const xuLyThayDoi = (truong: keyof DuLieuForm, giaTri: string | boolean | number) => {
    setDuLieuForm((prev) => ({
      ...prev,
      [truong]: giaTri,
    }));
  };

  const kiemTraForm = (): boolean => {
    const requiredFields: (keyof DuLieuForm)[] = [
      'benhVien',
      'chuyenKhoa',
      'bacSi',
      'bacSiId',
      'ngayHen',
      'gioHen',
      'hoTen',
      'email',
      'gioiTinh',
      'ngaySinh',
      'soDienThoai',
      'lyDoKham'
    ];

    for (const field of requiredFields) {
      if (!duLieuForm[field]) {
        alert(`Vui lòng điền đầy đủ thông tin ${field}`);
        return false;
      }
    }

    if (!duLieuForm.dongYDieuKhoan) {
      alert('Vui lòng đồng ý với các điều khoản và điều kiện');
      return false;
    }

    return true;
  };

  const xuLyGuiForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn()) {
      alert('Vui lòng đăng nhập để đặt lịch khám bệnh!');
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại!');
      return;
    }

    if (!kiemTraForm()) {
      return;
    }

    // Lấy token từ localStorage
    const token = localStorage.getItem('token');

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Thêm Authorization header vào đây
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctor_id: duLieuForm.bacSiId,
          user_id: currentUser.id,
          ngay_dat_lich: duLieuForm.ngayHen,
          gio_dat_lich: duLieuForm.gioHen,
          ten_benh_nhan: duLieuForm.hoTen,
          email: duLieuForm.email,
          gioi_tinh: duLieuForm.gioiTinh,
          ngay_sinh: duLieuForm.ngaySinh,
          so_dien_thoai: duLieuForm.soDienThoai,
          ly_do_kham: duLieuForm.lyDoKham,
          trang_thai: 'chờ xác nhận'
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Đặt lịch thành công:', data);
      alert('Đã gửi thông tin đặt lịch thành công!');

      // Reset form sau khi gửi thành công
      setDuLieuForm({
        benhVien: "",
        chuyenKhoa: "",
        bacSi: "",
        bacSiId: 0,
        ngayHen: "",
        gioHen: "",
        hoTen: "",
        email: "",
        gioiTinh: "",
        ngaySinh: "",
        soDienThoai: "",
        lyDoKham: "",
        dongYDieuKhoan: false,
      });

    } catch (err) {
      console.error('Lỗi khi đặt lịch:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi đặt lịch');
      alert('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-container">
      <div className="appointment-header">
        <h1>Đặt Lịch Khám Bệnh</h1>
        <p>Đặt lịch khám bệnh trực tuyến nhanh chóng và tiện lợi. Chúng tôi sẽ liên hệ xác nhận lịch hẹn của bạn trong thời gian sớm nhất.</p>
      </div>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={xuLyGuiForm} className="appointment-form">
        <Form1
          duLieuForm={duLieuForm}
          xuLyThayDoi={xuLyThayDoi}
        />
        <Form2
          duLieuForm={duLieuForm}
          xuLyThayDoi={xuLyThayDoi}
        />
        <div className="submit-section">
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Đang gửi...' : 'Gửi thông tin'}
            <span className="button-arrow"></span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DatLich; 