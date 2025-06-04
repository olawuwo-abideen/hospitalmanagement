import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity('reviews')
export class Review {
@PrimaryGeneratedColumn('uuid')
id: string;


@ManyToOne(() => User)
@JoinColumn({ name: 'user_id' })
user: User; 


@Column()
rating: number;

@Column({ type: 'text' })
comment: string;

@CreateDateColumn({ name: 'created_at' })
@Exclude()
createdAt: Date;

@UpdateDateColumn({ name: 'updated_at' })
@Exclude()
updatedAt: Date;

@DeleteDateColumn({ name: 'deleted_at', nullable: true })
@Exclude()
deletedAt: Date;
}
