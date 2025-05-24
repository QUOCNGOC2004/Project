import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsEmail } from "class-validator";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column({ unique: true })
    @IsEmail()
    email!: string;

    @Column()
    password!: string;

    @Column({ nullable: true })
    gioi_tinh!: string;

    @Column({ nullable: true })
    so_dien_thoai!: string;

    @Column({ type: 'date', nullable: true })
    ngay_sinh!: Date;
} 