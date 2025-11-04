import { Router } from "express";
import { InvoiceController } from "../controllers/InvoiceController";
import { auth } from "../middleware/auth"; 

const router = Router();

router.get("/appointment/:appointmentId", auth(['admin']), InvoiceController.getInvoiceByAppointmentId);

router.put("/appointment/:appointmentId", auth(['admin']), InvoiceController.upsertInvoiceByAppointmentId);

router.patch("/:invoiceId/status", auth(['admin']), InvoiceController.updateInvoiceStatus);

export default router;