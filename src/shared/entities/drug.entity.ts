import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Exclude, instanceToPlain } from 'class-transformer';


export enum DrugCategory {
ANTIBIOTIC = 'antibiotic',
ANALGESIC = 'analgesic',
ANTIVIRAL = 'antiviral',
ANTIFUNGAL = 'antifungal',
ANTIHISTAMINE = 'antihistamine',
ANTIPYRETIC = 'antipyretic',
ANTIHYPERTENSIVE = 'antihypertensive',
STEROID = 'steroid',
VACCINE = 'vaccine',
SUPPLEMENT = 'supplement',
ANTIDIABETIC = 'antidiabetic',
SEDATIVE = 'sedative',
ANTIDEPRESSANT = 'antidepressant',
BRONCHODILATOR = 'bronchodilator',
CONTRACEPTIVE = 'contraceptive',
CHEMOTHERAPY = 'chemotherapy',
CARDIAC = 'cardiac',
}

@Entity('drugs')
export class Drug {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column()
name: string;

@Column({ nullable: true })
description: string;

@Column({ nullable: true })
manufacturer: string;

@Exclude()
@Column({ type: 'int', default: 10 })
lowStockThreshold: number;

@Column('int')
quantity: number;

@Column({ type: 'datetime', nullable: true })
expiryDate: Date;

@Column({ type: 'enum', enum: DrugCategory})
category: DrugCategory;

@CreateDateColumn()
createdAt: Date;

@UpdateDateColumn()
updatedAt: Date;

toJSON?(): Record<string, any> {
return instanceToPlain(this);
}
}
