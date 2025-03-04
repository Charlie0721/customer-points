import { Redemptions } from './entities/redemption.entity';
import { Repository } from 'typeorm';
import { ServiceInterface } from '../commons/service-interface.commons';
import { Customer } from '../customers/entities/customer.entity';
export declare class RedemptionsService {
    private readonly redemptionRepository;
    private readonly customerRepository;
    constructor(redemptionRepository: Repository<Redemptions>, customerRepository: Repository<Customer>);
    create(customerId: number, pointsToRedeem: number): Promise<ServiceInterface>;
    findTransactionsByCustomer(nit: string): Promise<ServiceInterface>;
}
