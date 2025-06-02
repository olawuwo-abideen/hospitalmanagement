import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Bed } from './bed.entity';


export enum Department {
    CARDIOLOGY = 'cardiology',
    DENTISTRY = 'dentistry',
    NEUROLOGY = 'neurology',
    GYNECOLOGY = 'gynecology',
    ONCOLOGY = 'oncology',
    OPHTHALMOLOGY = 'ophthalmology',
    OTOLARYNGOLOGY = 'otolaryngology',
    PEDIATRICS = 'pediatrics',
    PSYCHIATRY = 'psychiatry',
    RADIOLOGY = 'radiology',
    EMERGENCY = 'emergency'
}


@Entity('wards')
export class Ward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  floor: number;

  @Column({ type: 'enum', enum: Department })
  department: Department;

  @OneToMany(() => Bed, bed => bed.ward)
  beds: Bed[];

  @CreateDateColumn({
  name: 'created_at',
  })
  createdAt: Date;
  
  @UpdateDateColumn({
  name: 'updated_at',
  })
  updatedAt: Date;
  
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;
}


