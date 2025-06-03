import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';


export enum PatientStatus {
  IN_PATIENT = 'in-patient',
  OUT_PATIENT = 'out-patient',
}

@Entity('admissions')
export class Admission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.admissions)
  patient: User;

  @Column({ default: true })
  isAdmitted: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  admittedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  dischargedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
