import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { UserBankAccount } from '../entity/UserBankAccount';

export class BankAccountController {

    // [GET] /api/bank-accounts/:user_id
    static async getByUserId(req: Request, res: Response) {
        const { user_id } = req.params;

        if (!user_id || isNaN(Number(user_id))) {
            return res.status(400).json({ success: false, message: 'Invalid user_id' });
        }

        try {
            const repo = AppDataSource.getRepository(UserBankAccount);
            const account = await repo.findOne({ where: { user_id: parseInt(user_id, 10) } });

            if (!account) {
                return res.status(404).json({ success: false, message: 'Bank account not found' });
            }

            return res.status(200).json({ success: true, data: account });
        } catch (error) {
            console.error('Error fetching bank account:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    // [PUT] /api/bank-accounts/:user_id  (Create if not exists, Update if exists)
    static async upsertByUserId(req: Request, res: Response) {
        const { user_id } = req.params;
        const { bank_name, account_holder, account_number, is_default } = req.body;

        if (!user_id || isNaN(Number(user_id))) {
            return res.status(400).json({ success: false, message: 'Invalid user_id' });
        }

        if (!bank_name || !account_holder || !account_number) {
            return res.status(400).json({ success: false, message: 'bank_name, account_holder and account_number are required' });
        }

        try {
            const repo = AppDataSource.getRepository(UserBankAccount);

            let account = await repo.findOne({ where: { user_id: parseInt(user_id, 10) } });

            if (!account) {
                account = repo.create({
                    user_id: parseInt(user_id, 10),
                    bank_name,
                    account_holder,
                    account_number,
                    is_default: is_default === undefined ? true : Boolean(is_default)
                });

                const newAccount = await repo.save(account);
                return res.status(201).json({ success: true, message: 'Bank account created successfully', data: newAccount });
            }

            account.bank_name = bank_name;
            account.account_holder = account_holder;
            account.account_number = account_number;
            if (is_default !== undefined) account.is_default = Boolean(is_default);

            const updatedAccount = await repo.save(account);
            return res.status(200).json({ success: true, message: 'Bank account updated successfully', data: updatedAccount });
        } catch (error) {
            console.error('Error updating bank account:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}
