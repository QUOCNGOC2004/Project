export interface Appointment {
  id: number;
  doctor_id: number;
  user_id: number;
  ngay_dat_lich: Date;
  gio_dat_lich: string;
  co_so_kham: string;
  chuyen_khoa: string;
  ten_benh_nhan: string;
  email: string;
  gioi_tinh: string;
  ngay_sinh: Date;
  so_dien_thoai: string;
  ly_do_kham?: string;
  trang_thai: string;
  created_at: Date;
  updated_at: Date;
} 