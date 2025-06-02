import { Exclude, instanceToPlain } from 'class-transformer';
import {
Entity,
PrimaryGeneratedColumn,
Column,
CreateDateColumn,
UpdateDateColumn,
OneToMany,
DeleteDateColumn
} from 'typeorm';
import { Review } from './review.entity';
import { Prescription } from './prescription.entity';
import { MedicalRecord } from './medical-record.entity';
import { Appointment } from './appointment.entity';
import { AvailabilitySlot } from './availabilityslot.entity';

export enum UserRole {
PATIENT = 'patient',
DOCTOR = 'doctor',
NURSE = 'nurse',
RECEPTIONIST = 'receptionist'
}

export enum DoctorSpecilization {
    CARDIOLOGY = 'cardiology',
    DENTISTRY = 'dentistry',
    NEUROLOGY = 'neurology',
    GYNECOLOGY = 'gynecology',
    ONCOLOGY = 'oncology',
    OPHTHALMOLOGY = 'ophthalmology',
    OTOLARYNGOLOGY = 'otolaryngology',
    PEDIATRICS = 'pediatrics',
    PSYCHIATRY = 'psychiatry',
    RADIOLOGY = 'radiology'
}

export enum Gender {
MALE = 'male',
FEMALE = 'female'
}

@Entity('users')
export class User {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({ name: 'firstname', length: 30, nullable: true })
firstname?: string;

@Column({ name: 'lastname', length: 30, nullable: true })
lastname?: string;

@Column({ name: 'age', nullable: true })
age?: number;

@Column({ unique: true, length: 50 })
email: string;

@Column({ unique: true, length: 20 })
phonenumber: string;

@Column({ nullable: true })
userimage?: string;

@Column({
type: 'enum',
enum: Gender,
nullable: true,
name: 'gender',

})
gender: Gender;

@Column({ default:false })
accountActivation: boolean;


@OneToMany(() => Review, (review) => review.user)
reviews?: Review[];

@OneToMany(() => Prescription, (prescription) => prescription.user)
prescriptions?: Prescription[];

@OneToMany(() => MedicalRecord, (medicalrecord) => medicalrecord.user)
medicalrecords?: MedicalRecord[];

@OneToMany(() => Appointment, (appointment) => appointment.user)
appointments?: Appointment[];

@OneToMany(() => AvailabilitySlot, (slot) => slot.user)
availabilitySlots: AvailabilitySlot[];

@Column()
@Exclude()
password: string;

@Column({ type: 'enum', enum: UserRole })
role: UserRole;

@Column({ type: 'varchar', name: 'reset_token', nullable: true })
@Exclude()
resetToken: string | null;

@Column({ name: 'specialization', nullable: true })
specialization?: string;


@Column({ name: 'experienceyears',  nullable: true })
experienceyears?: number;



@CreateDateColumn({
name: 'created_at',
})
@Exclude()
createdAt: Date;

@UpdateDateColumn({
name: 'updated_at',
})
@Exclude()
updatedAt: Date;

@DeleteDateColumn({ name: 'deleted_at', nullable: true })
@Exclude()
deletedAt: Date;

toJSON?(): Record<string, any> {
return instanceToPlain(this);
}
}
