import { CustomerPoints } from './customer-points.entity';
import { Redemptions } from '../../redemptions/entities/redemption.entity';
import { CustomerPointsKardex } from './customer-points-kardex';
export declare class Customer {
    id: number;
    nit: string;
    name: string;
    customerPoints: CustomerPoints[];
    redemptions: Redemptions[];
    kardexEntries: CustomerPointsKardex[];
}
