import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../views/css/DatLich.css';
import Form1 from '../../components/js/forDatLich/form1';
import Form2 from '../../components/js/forDatLich/form2';

interface DuLieuChiTietLichHen {
  benhVien: string;
  chuyenKhoa: string;
  bacSi: string;
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

interface DuLieuForm extends DuLieuChiTietLichHen, DuLieuBenhNhan {}

const DatLich: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  console.log('URL Search Params:', location.search);
  console.log('Hospital:', searchParams.get('hospital'));
  console.log('Specialty:', searchParams.get('specialty'));
  console.log('Doctor Name:', searchParams.get('doctorName'));

  const [duLieuForm, setDuLieuForm] = useState<DuLieuForm>({
    benhVien: searchParams.get('hospital') || "",
    chuyenKhoa: searchParams.get('specialty') || "",
    bacSi: searchParams.get('doctorName') || "",
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
    console.log('Form State:', duLieuForm);
  }, [duLieuForm]);

  const xuLyThayDoi = (truong: keyof DuLieuForm, giaTri: string | boolean) => {
    setDuLieuForm((prev) => ({
      ...prev,
      [truong]: giaTri,
    }));
  };

  const xuLyGuiForm = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form đã gửi:", duLieuForm);
    alert("Đã gửi thông tin đặt lịch thành công!");
  };

  return (
    <div className="appointment-container">
      <div className="appointment-header">
        <h1>Đặt Lịch Khám Bệnh</h1>
        <p>Đặt lịch khám bệnh trực tuyến nhanh chóng và tiện lợi. Chúng tôi sẽ liên hệ xác nhận lịch hẹn của bạn trong thời gian sớm nhất.</p>
      </div>
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
          <button type="submit" className="submit-button">
            Gửi thông tin
            <span className="button-arrow"></span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DatLich; 