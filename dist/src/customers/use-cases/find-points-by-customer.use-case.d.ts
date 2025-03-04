import { CustomersService } from '../customers.service';
import { ApiResponse } from '../../commons/response-api.commons';
export declare class FindPointByCustomerUseCase {
    private customersService;
    constructor(customersService: CustomersService);
    main(nit: string): Promise<ApiResponse<any>>;
}
