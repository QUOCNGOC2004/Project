import { Router } from 'express';
import { getBankAccount, upsertBankAccount } from '../controllers/BankAccountController';

const router = Router();

router.get('/', getBankAccount);
router.post('/', upsertBankAccount); 

export default router;