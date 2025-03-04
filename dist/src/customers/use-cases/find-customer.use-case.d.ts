import { CustomersService } from '../customers.service';
import { ApiResponse } from '../../commons/response-api.commons';
export declare class FindCustomerUseCase {
    private readonly customersService;
    constructor(customersService: CustomersService);
    main(nit: string): Promise<ApiResponse<any>>;
}
