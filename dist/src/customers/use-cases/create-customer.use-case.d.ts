import { CustomersService } from '../customers.service';
import { ApiResponse } from '../../commons/response-api.commons';
export declare class CreateCustomerUseCase {
    private readonly customersService;
    constructor(customersService: CustomersService);
    main(nit: string, name: string, points: number, expirationDays: number): Promise<ApiResponse<any>>;
    private calculateExpirationDate;
    private registerKardexEntry;
}
