import { CreateRedemptionDto } from './dto/create-redemption.dto';
import { CreatePointsRedemptionUseCase } from './use-cases/create-redemptions.use-case';
import { Response } from 'express';
import { FindCustomerUseCase } from '../customers/use-cases/find-customer.use-case';
import { TransactionsHistoryUseCase } from './use-cases/get-transactions-history.use-case';
export declare class RedemptionsController {
    private readonly createPointsRedemptionUseCase;
    private readonly findCustomerUseCase;
    private readonly transactionsHistoryUseCase;
    constructor(createPointsRedemptionUseCase: CreatePointsRedemptionUseCase, findCustomerUseCase: FindCustomerUseCase, transactionsHistoryUseCase: TransactionsHistoryUseCase);
    create(res: Response, createRedemptionDto: CreateRedemptionDto): Promise<Response<any, Record<string, any>>>;
    transactionsHistory(res: Response, nit: string): Promise<Response<any, Record<string, any>>>;
}
