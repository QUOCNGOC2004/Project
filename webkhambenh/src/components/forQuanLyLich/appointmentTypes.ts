export interface IServiceItem {
    name: string;
    price: number;
}
export interface IServiceDetails {
    benhLy: string;
    loiKhuyen: string;
    services: IServiceItem[];
}

export interface Appointment {
  id: number;
  ngay_dat_lich: string;
  gio_dat_lich: string;
  doctor_name: string;
  mo_ta_bac_si: string;
  doctor_phone: string;
  ly_do_kham: string;
  ten_benh_nhan: string;
  email: string;
  gioi_tinh: string;
  ngay_sinh: string;
  so_dien_thoai: string;
  trang_thai: string;
  total_amount?: number | null;
  service_details?: IServiceDetails | null;
}