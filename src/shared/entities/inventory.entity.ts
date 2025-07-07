import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';


export enum SupplyCategory {
SYRINGE = 'syringe',
GLOVE = 'glove',
MASK = 'mask',
DRUG = 'drug',
}

@Entity('inventory')
export class Inventory {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column()
itemName: string;

@Column({ type: 'enum', enum: SupplyCategory })
category: SupplyCategory;

@Column('int')
quantity: number;

@Column({ default: 0 })
used: number;

@Exclude()
@Column({ type: 'int', default: 10 })
lowStockThreshold: number;

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
