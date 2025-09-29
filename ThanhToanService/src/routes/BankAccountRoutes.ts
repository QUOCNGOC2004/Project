import { Router } from "express";
import { BankAccountController } from "../controllers/BankAccountController";

const router = Router();

router.get("/bank-account/:user_id", BankAccountController.getByUserId);
router.put("/bank-account/:user_id", BankAccountController.upsertByUserId);

export default router;
