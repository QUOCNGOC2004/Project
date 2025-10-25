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

    @Column({name: 'gioi_tinh', nullable: true})
    gioiTinh!: string;

    @Column({ name: 'mo_ta_bac_si' })
    moTaBacSi!: string;

    @Column({ name: 'hoc_vi' })
    hocVi!: string;

    @Column({ name: 'kinh_nghiem' })
    kinhNghiem!: number;

    @Column({ name: 'link_anh' })
    linkAnh!: string;

    constructor() {
        this.name = '';
        this.email = '';
        this.phone = '';
        this.gioiTinh = '';
        this.moTaBacSi = '';
        this.hocVi = '';
        this.kinhNghiem = 0;
        this.linkAnh = '';
    }
} 