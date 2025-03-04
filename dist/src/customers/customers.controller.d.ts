import { CreateCustomerDto } from './dto/create-customer.dto';
import { Response } from 'express';
import { CreateCustomerUseCase } from './use-cases/create-customer.use-case';
import { FindCustomerUseCase } from './use-cases/find-customer.use-case';
import { UpdatePointsUseCase } from './use-cases/update-customer-points.use-case';
import { FindPointByCustomerUseCase } from './use-cases/find-points-by-customer.use-case';
export declare class CustomersController {
    private readonly createCustomerUseCase;
    private readonly findCustomerUseCase;
    private readonly updatePointsUseCase;
    private readonly findPointByCustomerUseCase;
    constructor(createCustomerUseCase: CreateCustomerUseCase, findCustomerUseCase: FindCustomerUseCase, updatePointsUseCase: UpdatePointsUseCase, findPointByCustomerUseCase: FindPointByCustomerUseCase);
    create(response: Response, createCustomerDto: CreateCustomerDto): Promise<Response<any, Record<string, any>>>;
    findTotalPointsByCustomer(res: Response, nit: string): Promise<Response<any, Record<string, any>>>;
}
