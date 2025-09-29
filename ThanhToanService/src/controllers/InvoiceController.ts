import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Invoice } from '../entity/Invoice';

const invoiceRepo = AppDataSource.getRepository(Invoice);

// Lấy danh sách hóa đơn của user đang đăng nhập
export const getUserInvoices = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    try {
        const invoices = await invoiceRepo.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' }
        });
        return res.status(200).json(invoices);
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};

// Xử lý thanh toán mô phỏng
export const processMockPayment = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { invoiceId } = req.params; // Lấy ID của hóa đơn cần thanh toán

    try {
        const invoice = await invoiceRepo.findOne({ 
            where: { id: parseInt(invoiceId), user_id: userId } 
        });

        if (!invoice) {
            return res.status(404).json({ error: 'Không tìm thấy hóa đơn hoặc bạn không có quyền.' });
        }

        if (invoice.status === 'paid') {
            return res.status(400).json({ error: 'Hóa đơn này đã được thanh toán rồi.' });
        }

        // Đây là bước "Mô phỏng": chỉ cần cập nhật trạng thái
        invoice.status = 'paid';
        invoice.payment_date = new Date();
        // Bạn có thể tạo một mã giao dịch giả ở đây
        // invoice.transaction_id = `MOCK_${...}`

        await invoiceRepo.save(invoice);

        // TODO: Xóa cache liên quan nếu có

        return res.status(200).json({ message: 'Thanh toán thành công!', invoice });
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};

