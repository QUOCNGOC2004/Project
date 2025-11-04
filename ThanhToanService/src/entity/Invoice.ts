import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

export interface IServiceItem {
    name: string;
    price: number;
}
export interface IServiceDetails {
    benhLy: string;
    loiKhuyen: string;
    services: IServiceItem[];
}

@Entity("invoices")
export class Invoice {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'integer', unique: true })
    appointment_id!: number;

    @Column({ type: "varchar", length: 50, unique: true })
    invoice_code!: string;

    @Column({ type: "decimal", precision: 12, scale: 2 })
    total_amount!: number;

    @Column({ type: "varchar", length: 20, default: 'pending' })
    status!: string;

    @Column({ type: "jsonb", nullable: true })
    service_details?: IServiceDetails;

    @Column({ type: "timestamptz", nullable: true })
    payment_date?: Date;
    
    @Column({ type: "varchar", length: 255, nullable: true })
    transaction_id?: string;
    
    
    @CreateDateColumn({ type: "timestamptz" })
    created_at!: Date;
}