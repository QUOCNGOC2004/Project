import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
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

    @Column({ default: false })
    isVerified!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    constructor() {
        this.isVerified = false;
    }
} 