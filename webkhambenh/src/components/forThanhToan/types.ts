export interface Service {
  name: string;
  price: number;
}

export interface ApiAppointment {
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

export interface Appointment {
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