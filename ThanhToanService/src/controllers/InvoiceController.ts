import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Invoice } from '../entity/Invoice';

const invoiceRepo = AppDataSource.getRepository(Invoice);

// [GET] /api/invoices/appointment/:appointmentId
export const getInvoiceByAppointmentId = async (req: Request, res: Response) => {
    const { appointmentId } = req.params;

    if (!appointmentId || isNaN(Number(appointmentId))) {
        return res.status(400).json({ success: false, message: 'Invalid appointmentId' });
    }

    try {
        const invoice = await invoiceRepo.findOne({ where: { appointment_id: parseInt(appointmentId, 10) } });
        if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
        return res.status(200).json({ success: true, data: invoice });
    } catch (error) {
        console.error('Error fetching invoice by appointment id:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// [PUT] /api/invoices/appointment/:appointmentId  (create or update invoice for appointment)
export const upsertInvoiceByAppointmentId = async (req: Request, res: Response) => {
    const { appointmentId } = req.params;
    const { invoice_code, total_amount, service_details, payment_date, transaction_id } = req.body;

    if (!appointmentId || isNaN(Number(appointmentId))) {
        return res.status(400).json({ success: false, message: 'Invalid appointmentId' });
    }

    if (!invoice_code || total_amount === undefined) {
        return res.status(400).json({ success: false, message: 'invoice_code and total_amount are required' });
    }

    try {
        let invoice = await invoiceRepo.findOne({ where: { appointment_id: parseInt(appointmentId, 10) } });

            if (!invoice) {
                // create instance and assign fields to satisfy TypeScript types
                const newInv = new Invoice();
                newInv.appointment_id = parseInt(appointmentId, 10);
                newInv.invoice_code = invoice_code;
                newInv.total_amount = total_amount;
                newInv.service_details = service_details || undefined;
                newInv.payment_date = payment_date ? new Date(payment_date) : undefined;
                newInv.transaction_id = transaction_id || undefined;

                const newInvoice = await invoiceRepo.save(newInv);
            return res.status(201).json({ success: true, message: 'Invoice created', data: newInvoice });
        }

        // update existing invoice
        invoice.invoice_code = invoice_code;
        invoice.total_amount = total_amount;
        invoice.service_details = service_details || invoice.service_details;
        invoice.payment_date = payment_date ? new Date(payment_date) : invoice.payment_date;
        invoice.transaction_id = transaction_id || invoice.transaction_id;

        const updated = await invoiceRepo.save(invoice);
        return res.status(200).json({ success: true, message: 'Invoice updated', data: updated });
    } catch (error) {
        console.error('Error upserting invoice:', error);
        // Handle unique constraint violation on invoice_code or appointment_id
        const errMsg = (error as any)?.message || 'Internal server error';
        return res.status(500).json({ success: false, message: errMsg });
    }
};

