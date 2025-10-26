import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Doctor } from "./Doctor";
import { TimeSlot } from "./TimeSlot";
@Entity('doctor_schedules')
export class DoctorSchedule {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'doctor_id' })
    doctorId!: number;

    @Column({ type: 'date', name: 'work_date' })
    workDate!: string;

    @Column({ type: 'time', name: 'start_time' })
    startTime!: string;

    @Column({ type: 'time', name: 'end_time' })
    endTime!: string;

   
    @ManyToOne(() => Doctor, doctor => doctor.id, {
       
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ name: 'doctor_id' })
    doctor!: Doctor;

  
    @OneToMany(() => TimeSlot, timeSlot => timeSlot.schedule, {
        cascade: true,
        eager: true 
    })
    timeSlots!: TimeSlot[];
}