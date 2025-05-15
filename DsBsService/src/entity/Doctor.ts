import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('doctors')
export class Doctor {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column({ nullable: true })
    phone!: string;

    @Column({ name: 'co_so_kham' })
    coSoKham!: string;

    @Column({ name: 'chuyen_khoa' })
    chuyenKhoa!: string;

    @Column({ name: 'chuc_vu' })
    chucVu!: string;

    @Column({ name: 'hoc_vi' })
    hocVi!: string;

    @Column({ name: 'kinh_nghiem' })
    kinhNghiem!: string;

    @Column({ name: 'link_anh' })
    linkAnh!: string;

    constructor() {
        this.name = '';
        this.email = '';
        this.phone = '';
        this.coSoKham = '';
        this.chuyenKhoa = '';
        this.chucVu = '';
        this.hocVi = '';
        this.kinhNghiem = '';
        this.linkAnh = '';
    }
} 