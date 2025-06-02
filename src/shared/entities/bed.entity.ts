import {
Entity,
PrimaryGeneratedColumn,
Column,
ManyToOne,
JoinColumn,
CreateDateColumn,
UpdateDateColumn,
DeleteDateColumn,
} from 'typeorm';
import { Ward } from './ward.entity';

export enum BedStatus {
AVAILABLE = 'available',
OCCUPIED = 'occupied',
MAINTENANCE = 'maintenance',
}

export enum BedType {
ICU = 'icu',
GENERAL = 'general',
PRIVATE = 'private',
EMERGENCY = 'emergency',
}


@Entity('beds')
export class Bed {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({ name: 'bed_number' })
bedNumber: number;

@Column({ type: 'enum', enum: BedType, default: BedType.EMERGENCY })
bedType: BedType; 

@Column({ type: 'enum', enum: BedStatus, default: BedStatus.AVAILABLE })
bedStatus: BedStatus;

@ManyToOne(() => Ward, ward => ward.beds)
@JoinColumn({ name: 'ward_id' })
ward: Ward;

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
