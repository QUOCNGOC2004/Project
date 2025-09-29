import { Router } from 'express';
import { getUserInvoices, processMockPayment } from '../controllers/InvoiceController';

const router = Router();

router.get('/', getUserInvoices);
router.post('/:invoiceId/pay', processMockPayment);

export default router;