import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { UserBankAccount } from '../entity/UserBankAccount';

const bankAccountRepo = AppDataSource.getRepository(UserBankAccount);

export const getBankAccount = async (req: Request, res: Response) => {
    // Giả sử user_id được lấy từ middleware xác thực token
    const userId = (req as any).user.id; 

    try {
        const bankAccount = await bankAccountRepo.findOne({ where: { user_id: userId } });
        if (!bankAccount) {
            return res.status(404).json({ message: 'Chưa liên kết tài khoản ngân hàng.' });
        }
        return res.status(200).json(bankAccount);
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};

// Tạo hoặc cập nhật thông tin tài khoản ngân hàng
export const upsertBankAccount = async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { bank_name, account_holder, account_number } = req.body;

    if (!bank_name || !account_holder || !account_number) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin.' });
    }

    try {
        let bankAccount = await bankAccountRepo.findOne({ where: { user_id: userId } });

        if (!bankAccount) {
            bankAccount = bankAccountRepo.create({ user_id: userId });
        }

        bankAccount.bank_name = bank_name;
        bankAccount.account_holder = account_holder;
        bankAccount.account_number = account_number;

        const savedAccount = await bankAccountRepo.save(bankAccount);
        return res.status(200).json(savedAccount);
    } catch (error) {
        return res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};