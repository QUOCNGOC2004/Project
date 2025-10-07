import { Router } from 'express';
import { getInvoiceByAppointmentId, upsertInvoiceByAppointmentId } from '../controllers/InvoiceController';

const router = Router();

// Mounted at /api/invoices in index.ts
router.get('/appointment/:appointmentId', getInvoiceByAppointmentId);
router.put('/appointment/:appointmentId', upsertInvoiceByAppointmentId);

export default router;