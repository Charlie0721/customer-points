import { ApiResponse } from '../../commons/response-api.commons';
import { RedemptionsService } from '../redemptions.service';
export declare class TransactionsHistoryUseCase {
    private readonly redemptionsService;
    constructor(redemptionsService: RedemptionsService);
    main(nit: string): Promise<ApiResponse<any>>;
    private parseData;
}
