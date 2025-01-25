import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CustomerPoints } from './customer-points.entity';
import { Redemptions } from '../../redemptions/entities/redemption.entity';
import { CustomerPointsKardex } from './customer-points-kardex';

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

  @OneToMany(() => Redemptions, (redemption) => redemption.customer)
  redemptions: Redemptions[];

  @OneToMany(() => CustomerPointsKardex, (kardexEntry) => kardexEntry.customer)
  kardexEntries: CustomerPointsKardex[];
}
