import React from 'react';
import { Appointment } from './types';
import './PaymentSuccessView.css';
import { jsPDF } from 'jspdf';
import { formatCurrency } from './hamXyLy';

interface PaymentSuccessViewProps {
  appointment: Appointment;
}

export const PaymentSuccessView: React.FC<PaymentSuccessViewProps> = ({ appointment }) => {
  
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica');

    let y = 20; 

    doc.setFontSize(18);
    doc.text('HOA DON THANH TOAN', 105, y, { align: 'center' });
    y += 10;
    doc.setFontSize(14);
    doc.setTextColor(0, 150, 0);
    doc.text('Trang thai : Thanh toan thanh cong', 105, y, { align: 'center' });
    doc.setTextColor(0, 0, 0); 
    y += 15;

    doc.setFontSize(12);
    doc.text(`Chi tiet chi phi - BN: ${appointment.patientName}`, 14, y);
    y += 7;
    doc.setLineDashPattern([1, 1], 0);
    doc.line(14, y, 196, y); 
    y += 7;

    appointment.services?.forEach((s) => {
      doc.text(s.name, 16, y);
      doc.text(formatCurrency(s.price), 194, y, { align: 'right' });
      y += 7;
    });
    
    doc.setLineDashPattern([], 0);
    doc.setLineWidth(0.5);
    doc.line(14, y, 196, y); 
    y += 7;

    doc.setFont('helvetica', 'bold');
    doc.text('Tong cong', 16, y);
    doc.text(formatCurrency(appointment.totalAmount || 0), 194, y, { align: 'right' });
    y += 15;
    doc.setFont('helvetica', 'normal');

    doc.setFontSize(10);
    doc.text('Chi tiet hoa don', 14, y);
    doc.setFont('helvetica', 'bold');
    doc.text('Ma hoa đơn:', 16, y += 6);
    doc.setFont('helvetica', 'normal');
    doc.text(appointment.invoiceCode || 'N/A', 50, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Ngay tao hoa đơn:', 16, y += 6);
    doc.setFont('helvetica', 'normal');
    doc.text(appointment.invoiceCreatedAt || 'N/A', 50, y);
    y += 10;

    doc.setFontSize(10);
    doc.text('Thong tin phong kham', 14, y);
    doc.setFont('helvetica', 'bold');
    doc.text('Ten phong kham:', 16, y += 6);
    doc.setFont('helvetica', 'normal');
    doc.text('Phong kham Dai Hoc Phenikaa', 50, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Dia chi:', 16, y += 6);
    doc.setFont('helvetica', 'normal');
    doc.text('Trinh Van Bo, Xuan Phuong, Nam Tu Liem, Ha Noi', 50, y);

    doc.setFont('helvetica', 'bold');
    doc.text('SDT:', 16, y += 6);
    doc.setFont('helvetica', 'normal');
    doc.text('0981714085', 50, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Email lien he:', 16, y += 6);
    doc.setFont('helvetica', 'normal');
    doc.text('phenikaa@gmail.com', 50, y);
    y += 10;

    doc.setFontSize(10);
    doc.text('Thong tin tai khoan da nhan thanh toan', 14, y);
    doc.setFont('helvetica', 'bold');
    doc.text('Ngan hang:', 16, y += 6);
    doc.setFont('helvetica', 'normal');
    doc.text('VpBank', 50, y);

    doc.setFont('helvetica', 'bold');
    doc.text('Chu tai khoan:', 16, y += 6);
    doc.setFont('helvetica', 'normal');
    doc.text('Nguyen Quoc Ngcc', 50, y);
    
    doc.setFont('helvetica', 'bold');
    doc.text('So tai khoan:', 16, y += 6);
    doc.setFont('helvetica', 'normal');
    doc.text('0981714085', 50, y);

    // 3. Lưu file
    doc.save(`HoaDon-${appointment.invoiceCode || 'payment'}.pdf`);
  };

  return (
    <div className="payment-success">
      <div className="icon">✅</div>
      <h3>Thanh Toán Thành Công!</h3>
      <p>
        Cảm ơn bạn đã hoàn tất thanh toán cho lịch hẹn ngày {appointment.date}.
      </p>
      <div className="transaction-id">
        Mã giao dịch: <strong>{appointment.invoiceCode}</strong>
      </div>
      
      <button 
        className="btn btn-success" 
        style={{ marginTop: '1rem' }}
        onClick={handleDownloadPDF}
      >
        Tải Hóa Đơn PDF
      </button>
    </div>
  );
};