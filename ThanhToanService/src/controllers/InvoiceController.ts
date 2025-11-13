import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Invoice, IServiceDetails } from '../entity/Invoice'; 

const invoiceRepo = AppDataSource.getRepository(Invoice);

export class InvoiceController {
    static async getInvoiceByAppointmentId(req: Request, res: Response) {
        const { appointmentId } = req.params;

        if (isNaN(Number(appointmentId))) {
            return res.status(400).json({ success: false, message: 'Invalid appointmentId' });
        }

        try {
            const invoice = await invoiceRepo.findOne({ 
                where: { appointment_id: parseInt(appointmentId, 10) } 
            });

            if (!invoice) {
                return res.status(404).json({ success: false, message: 'Invoice not found' });
            }
            
            return res.status(200).json({ success: true, data: invoice });
        } catch (error) {
            console.error('Error fetching invoice:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async upsertInvoiceByAppointmentId(req: Request, res: Response) {
        const { appointmentId } = req.params;
        
        const { 
            benhLy, 
            loiKhuyen, 
            services, 
            total_amount 
        } = req.body;

        if (isNaN(Number(appointmentId))) {
            return res.status(400).json({ success: false, message: 'Invalid appointmentId' });
        }

        if (!services || !Array.isArray(services) || services.length === 0 || total_amount === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: 'services (array) and total_amount are required' 
            });
        }

        // Đóng gói dữ liệu chi tiết vào đối tượng JSON
        const service_details: IServiceDetails = {
            benhLy: benhLy || '',
            loiKhuyen: loiKhuyen || '',
            services: services
        };

        try {
            let invoice = await invoiceRepo.findOne({ 
                where: { appointment_id: parseInt(appointmentId, 10) } 
            });

    
            const isCreating = !invoice;

            if (!invoice) {
                invoice = new Invoice();
                invoice.appointment_id = parseInt(appointmentId, 10);
                
                // Tạo mã hóa đơn duy nhất
                invoice.invoice_code = `INV-${appointmentId}-${Date.now().toString().slice(-6)}`;
                
                // Trạng thái mặc định khi mới tạo là 'pending' (chưa thanh toán)
                invoice.status = 'pending'; 
            }

            
            invoice.service_details = service_details;
            invoice.total_amount = parseFloat(total_amount); 

            const savedInvoice = await invoiceRepo.save(invoice);
            
            try {
                const appointmentResult = await AppDataSource.query(
                  `SELECT user_id, ngay_dat_lich FROM appointments WHERE id = $1`,
                  [savedInvoice.appointment_id]
                );

                if (appointmentResult.length > 0) {
                  const { user_id, ngay_dat_lich } = appointmentResult[0];
                  
                  const ngayKhamFormatted = new Date(ngay_dat_lich).toLocaleDateString('vi-VN');
                  let message = "";
                  let type = "";

                  if (isCreating) {
                      message = `Hóa đơn cho lịch hẹn ngày ${ngayKhamFormatted} vừa được tạo. Vui lòng kiểm tra và thanh toán.`;
                      type = 'invoice_created';
                  } else {
                      message = `Hóa đơn cho lịch hẹn ngày ${ngayKhamFormatted} vừa được cập nhật. Vui lòng kiểm tra và thanh toán.`;
                      type = 'invoice_updated';
                  }

                  // 2. INSERT thông báo
                  await AppDataSource.query(
                    `INSERT INTO notifications (user_id, message, type) VALUES ($1, $2, $3)`,
                    [user_id, message, type]
                  );
                }
            } catch (notificationError) {
                console.error("Lỗi khi tạo thông báo hóa đơn:", notificationError);
            }
    
            const message = isCreating ? 'Invoice created successfully' : 'Invoice updated successfully';
            const statusCode = isCreating ? 201 : 200;

            return res.status(statusCode).json({ success: true, message, data: savedInvoice });

        } catch (error) {
            console.error('Error upserting invoice:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }


    static async updateInvoiceStatus(req: Request, res: Response) {
        const { invoiceId } = req.params;
        const { status, payment_date, transaction_id } = req.body; // 'pending' | 'paid' | 'cancelled'

        if (isNaN(Number(invoiceId))) {
            return res.status(400).json({ success: false, message: 'Invalid invoiceId' });
        }
        if (!status) {
            return res.status(400).json({ success: false, message: 'Status is required' });
        }

        try {
            const invoice = await invoiceRepo.findOne({ where: { id: parseInt(invoiceId, 10) } });
            if (!invoice) {
                return res.status(404).json({ success: false, message: 'Invoice not found' });
            }

            invoice.status = status;
            
            if (status === 'paid') {
                invoice.payment_date = payment_date ? new Date(payment_date) : new Date();
                invoice.transaction_id = transaction_id || invoice.transaction_id; 
            } else {
                 invoice.payment_date = undefined;
                 invoice.transaction_id = undefined;
            }

            const updatedInvoice = await invoiceRepo.save(invoice);
            return res.status(200).json({ success: true, message: 'Invoice status updated', data: updatedInvoice });

        } catch (error) {
            console.error('Error updating invoice status:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}