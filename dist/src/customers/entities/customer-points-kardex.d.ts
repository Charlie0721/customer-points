import { Customer } from './customer.entity';
export declare class CustomerPointsKardex {
    id: number;
    customer_id: number;
    previous_points: number;
    new_points: number;
    difference: number;
    reason: string;
    transaction_type: 'acquisition' | 'redemption';
    expiration_date: Date;
    created_at: Date;
    customer: Customer;
}
