import { ApiResponse } from '../../commons/response-api.commons';
import { CustomersService } from '../customers.service';
export declare class UpdatePointsUseCase {
    private readonly customersService;
    constructor(customersService: CustomersService);
    main(customerId: number, points: number, expirationDays: number): Promise<ApiResponse<any>>;
    private searchCustomerPoints;
    private addPoints;
    private calculateExpirationDate;
    private registerKardexEntry;
}
