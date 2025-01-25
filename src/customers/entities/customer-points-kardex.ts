import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity('customer_points_kardex')
export class CustomerPointsKardex {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  customer_id: number;

  @Column({ type: 'int', nullable: false })
  previous_points: number;

  @Column({ type: 'int', nullable: false })
  new_points: number;

  @Column({ type: 'int', nullable: false })
  difference: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  reason: string;

  @Column({
    type: 'enum',
    enum: ['acquisition', 'redemption'],
    nullable: false,
  })
  transaction_type: 'acquisition' | 'redemption';

  @Column({ type: 'date', nullable: true })
  expiration_date: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  
  @ManyToOne(() => Customer, (customer) => customer.kardexEntries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

}
