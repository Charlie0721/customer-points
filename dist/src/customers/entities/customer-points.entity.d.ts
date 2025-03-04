import { Customer } from './customer.entity';
export declare class CustomerPoints {
    id: number;
    customer_id: number;
    points: number;
    expiration_date: Date;
    created_at: Date;
    updated_at?: Date;
    customer: Customer;
}
