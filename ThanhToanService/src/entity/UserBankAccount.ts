import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("user_bank_accounts")
export class UserBankAccount {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'integer' })
    user_id!: number;

    @Column({ type: "varchar", length: 255 })
    bank_name!: string;

    @Column({ type: "varchar", length: 255 })
    account_holder!: string;

    @Column({ type: "varchar", length: 50 })
    account_number!: string;
    
    @CreateDateColumn({ type: "timestamptz" })
    created_at!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at!: Date;
}