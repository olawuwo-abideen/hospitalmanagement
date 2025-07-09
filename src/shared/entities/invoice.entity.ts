import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from 'src/shared/entities/user.entity';
import { Exclude } from 'class-transformer';

export enum PaymentStatus {
PENDING = 'pending',
PAID = 'paid',
UNPAID = 'unpaid',
}

export enum StripePaymentMethod {
CARD = 'card',
SEPA_DEBIT = 'sepa_debit',
IDEAL = 'ideal',
BANCONTACT = 'bancontact',
GIROPAY = 'giropay',
AFTERPAY = 'afterpay_clearpay',
}


@Entity('invoices')
export class Invoice {
@PrimaryGeneratedColumn('uuid')
id: string;

@ManyToOne(() => User, (user) => user.invoices, { onDelete: 'CASCADE' })
patient: User;

@Column()
description: string;

@Column('decimal', { precision: 10, scale: 2 })
amount: number;

@Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
status: PaymentStatus;

@Column({ nullable: true })
paymentMethod: StripePaymentMethod;

@Column({ nullable: true })
paymentIntentId?: string;


@Column({ type: 'timestamp', nullable: true })
paidAt: Date;

@CreateDateColumn({
name: 'created_at',
})
createdAt: Date;

@UpdateDateColumn({
name: 'updated_at',
})
@Exclude()
updatedAt: Date;

@DeleteDateColumn({ name: 'deleted_at', nullable: true })
@Exclude()
deletedAt: Date;

}
