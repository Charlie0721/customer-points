import { Customer } from '../../customers/entities/customer.entity';
export declare class Redemptions {
    id: number;
    customer_id: number;
    points: number;
    redeemed_at: Date;
    customer: Customer;
}
