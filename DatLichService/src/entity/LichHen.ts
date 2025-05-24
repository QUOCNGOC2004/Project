import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class LichHen {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    doctor_id!: number;

    @Column()
    user_id!: number;

    @Column()
    ngay_dat_lich!: Date;

    @Column()
    gio_dat_lich!: string;

    @Column()
    ten_benh_nhan!: string;

    @Column()
    email!: string;

    @Column()
    gioi_tinh!: string;

    @Column()
    ngay_sinh!: Date;

    @Column()
    so_dien_thoai!: string;

    @Column({ nullable: true })
    ly_do_kham?: string;

    @Column()
    trang_thai!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
} 