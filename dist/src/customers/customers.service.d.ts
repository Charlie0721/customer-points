import { ServiceInterface } from '../commons/service-interface.commons';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { CustomerPoints } from './entities/customer-points.entity';
import { CustomerPointsKardex } from './entities/customer-points-kardex';
export declare class CustomersService {
    private readonly customerRepository;
    private readonly customerPointsRepository;
    private readonly customerPointsKardexRepository;
    private queryRunner;
    constructor(customerRepository: Repository<Customer>, customerPointsRepository: Repository<CustomerPoints>, customerPointsKardexRepository: Repository<CustomerPointsKardex>);
    create(nit: string, name: string, points: number, expirationDays: number): Promise<ServiceInterface>;
    private saveCustomerPoints;
    findOne(nit: string): Promise<ServiceInterface>;
    findPointsByCustomerId(customerId: number): Promise<ServiceInterface>;
    updatePoints(id: number, totalPoints: number, expirationDate: Date): Promise<ServiceInterface>;
    findPointsByCustomer(nit: string): Promise<ServiceInterface>;
    createKardex(kardexEntry: Partial<CustomerPointsKardex>): Promise<CustomerPointsKardex>;
}
