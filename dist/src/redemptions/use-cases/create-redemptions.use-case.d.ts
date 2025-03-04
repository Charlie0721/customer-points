import { RedemptionsService } from '../redemptions.service';
import { ApiResponse } from '../../commons/response-api.commons';
import { CustomersService } from '../../customers/customers.service';
export declare class CreatePointsRedemptionUseCase {
    private readonly redemptionsService;
    private readonly customersService;
    constructor(redemptionsService: RedemptionsService, customersService: CustomersService);
    main(customerId: number, pointsToRedeem: number): Promise<ApiResponse<any>>;
    private searchCustomerPoints;
    private sortPointsByExpiration;
    private registerKardexEntry;
}
