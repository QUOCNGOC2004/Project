import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { DoctorSchedule } from "./DoctorSchedule";

@Entity('time_slots')
export class TimeSlot {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'schedule_id' })
    scheduleId!: number;

    @Column({ type: 'time', name: 'slot_time' })
    slotTime!: string;

    @Column({ name: 'is_available', default: true })
    isAvailable!: boolean;

    @Column({ type: 'int', name: 'appointment_id', nullable: true })
    appointmentId!: number | null;
    
    @ManyToOne(() => DoctorSchedule, schedule => schedule.timeSlots, {
        onDelete: 'CASCADE' 
    })
    @JoinColumn({ name: 'schedule_id' })
    schedule!: DoctorSchedule;
}