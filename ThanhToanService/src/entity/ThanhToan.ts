import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ThanhToan {
    @PrimaryGeneratedColumn()
    id!: number;

    // Fields from user_bank_accounts
    @Column()
    user_id!: number; // FOREIGN KEY to users(id)

    @Column({ type: "varchar", length: 255 })
    bank_name!: string;

    @Column({ type: "varchar", length: 255 })
    account_holder!: string;

    @Column({ type: "varchar", length: 50 })
    account_number!: string;

    @Column({ type: "boolean", default: true })
    is_default!: boolean;

    @CreateDateColumn({ type: "timestamptz" })
    bank_account_created_at!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    bank_account_updated_at!: Date;

    // Fields from invoices
    @Column()
    appointment_id!: number; // FOREIGN KEY to appointments(id)

    @Column({ type: "varchar", length: 50, unique: true })
    invoice_code!: string;

    @Column({ type: "decimal", precision: 12, scale: 2 })
    total_amount!: number;

    @Column({ type: "jsonb", nullable: true })
    service_details?: any; // JSONB for service details

    @Column({ type: "timestamptz", nullable: true })
    payment_date?: Date;

    @Column({ type: "varchar", length: 255, nullable: true })
    transaction_id?: string;

    @CreateDateColumn({ type: "timestamptz" })
    invoice_created_at!: Date;
}