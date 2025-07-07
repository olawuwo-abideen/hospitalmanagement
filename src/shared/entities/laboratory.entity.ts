import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from './user.entity'; 
import { Exclude } from 'class-transformer';

export enum LabTestType {
BLOOD_TEST = 'blood_test',
URINE_TEST = 'urine_test',
XRAY = 'xray',
MRI = 'mri',
CT_SCAN = 'ct_scan',
ECG = 'ecg',
COVID19 = 'covid19',
MALARIA = 'malaria',
TYPHOID = 'typhoid',
LIVER_FUNCTION = 'liver_function',
KIDNEY_FUNCTION = 'kidney_function',
STOOL_TEST = 'stool_test',
HEPATITIS = 'hepatitis',
HIV = 'hiv',
PREGNANCY = 'pregnancy',
}

export enum LabTestStatus {
PENDING = 'pending',
COMPLETED = 'completed',
CANCELLED = 'cancelled',
}

@Entity('lab_tests')
export class LabTest {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({ type: 'enum', enum: LabTestType })
testType: LabTestType;

@Column({ nullable: true })
result?: string;

@Column({ type: 'enum', enum: LabTestStatus, default: LabTestStatus.PENDING })
status: LabTestStatus;

@ManyToOne(() => User, (user) => user.labTests)
patient: User;

@CreateDateColumn({
name: 'created_at',
})
createdAt: Date;

@UpdateDateColumn({
name: 'updated_at',
})
updatedAt: Date;

@DeleteDateColumn({ name: 'deleted_at', nullable: true })
@Exclude()
deletedAt: Date;

}
