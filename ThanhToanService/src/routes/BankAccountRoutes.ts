import { Router } from "express";
import { BankAccountController } from "../controllers/BankAccountController";


const router = Router();

// Mounted at /api/bank-accounts in index.ts -> final paths: /api/bank-accounts/:user_id
router.get("/:user_id", BankAccountController.getByUserId);
router.put("/:user_id", BankAccountController.upsertByUserId);

export default router;
