import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { UserBankAccount } from '../entity/UserBankAccount';
import { cacheUser, invalidateUserCache } from '../services/CacheService';

export class BankAccountController {

    // [GET] /bank-account/:user_id
    static async getByUserId(req: Request, res: Response) {
        const { user_id } = req.params;

        try {
            // 1. Kiểm tra cache trước
            const cachedData = await cacheUser.get(user_id);
            if (cachedData) {
                return res.status(200).json({
                    success: true,
                    source: "cache",
                    data: cachedData
                });
            }

            // 2. Không có cache thì query DB
            const repo = AppDataSource.getRepository(UserBankAccount);
            const account = await repo.findOne({
                where: { user_id: parseInt(user_id, 10) }
            });

            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: "Bank account not found"
                });
            }

            // 3. Lưu cache
            await cacheUser.set(user_id, account);

            return res.status(200).json({
                success: true,
                source: "database",
                data: account
            });

        } catch (error) {
            console.error("Error fetching bank account:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }

    // [PUT] /bank-account/:user_id  (Create if not exists, Update if exists)
    static async upsertByUserId(req: Request, res: Response) {
        const { user_id } = req.params;
        const { bank_name, account_holder, account_number } = req.body;

        if (!bank_name || !account_holder || !account_number) {
            return res.status(400).json({
                success: false,
                message: "bank_name, account_holder, and account_number are required"
            });
        }

        try {
            const repo = AppDataSource.getRepository(UserBankAccount);

            let account = await repo.findOne({
                where: { user_id: parseInt(user_id, 10) }
            });

            if (!account) {
                // Tạo mới nếu chưa có
                account = repo.create({
                    user_id: parseInt(user_id, 10),
                    bank_name,
                    account_holder,
                    account_number
                });

                const newAccount = await repo.save(account);

                await invalidateUserCache(user_id);
                await cacheUser.set(user_id, newAccount);

                return res.status(201).json({
                    success: true,
                    message: "Bank account created successfully",
                    data: newAccount
                });
            }

            // Update nếu đã có
            account.bank_name = bank_name;
            account.account_holder = account_holder;
            account.account_number = account_number;

            const updatedAccount = await repo.save(account);

            await invalidateUserCache(user_id);
            await cacheUser.set(user_id, updatedAccount);

            return res.status(200).json({
                success: true,
                message: "Bank account updated successfully",
                data: updatedAccount
            });

        } catch (error) {
            console.error("Error updating bank account:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}
