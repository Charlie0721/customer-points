import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CustomerPoints } from './customer-points.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nit: string;

  @Column()
  name: string;

  @OneToMany(() => CustomerPoints, (points) => points.customer)
  customerPoints: CustomerPoints[];
}
