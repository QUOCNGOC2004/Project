

export type AppointmentStatus = 'chờ xác nhận' | 'đã xác nhận' | 'chưa thanh toán' | 'đã thanh toán';

// Dùng trong component
export interface Appointment {
  id: number;
  ten_benh_nhan: string;
  doctorName: string; 
  ngay_dat_lich: string;
  gio_dat_lich: string;
  trang_thai: AppointmentStatus;
  hasInvoice?: boolean;

  doctorId: number;
  userId: number;
  email: string;
  gioiTinh: string;
  ngaySinh: string;
  soDienThoai: string;
  lyDoKham: string;
}

// Dùng để map từ API
export interface ApiAppointment {
  id: number;
  ten_benh_nhan: string;
  doctor_name: string; 
  ngay_dat_lich: string;
  gio_dat_lich: string;
  trang_thai: AppointmentStatus;
  hasinvoice: boolean; 
  
  doctor_id: number;
  user_id: number;
  email: string;
  gioi_tinh: string;
  ngay_sinh: string;
  so_dien_thoai: string;
  ly_do_kham: string;
}

export interface InvoiceService {
  name: string;
  price: number;
}

export interface DoctorDetails {
    phone: string;
}

export interface UserDetails {
    username: string;
    email: string;
    so_dien_thoai: string;
    gioi_tinh: string;
    ngay_sinh: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface BankAccount {
  id: number;
  user_id: number;
  bank_name: string;
  account_holder: string;
  account_number: string;
  is_default: boolean;
}