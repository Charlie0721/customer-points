"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsHistoryUseCase = void 0;
const common_1 = require("@nestjs/common");
const response_api_commons_1 = require("../../commons/response-api.commons");
const redemptions_service_1 = require("../redemptions.service");
let TransactionsHistoryUseCase = class TransactionsHistoryUseCase {
    constructor(redemptionsService) {
        this.redemptionsService = redemptionsService;
    }
    async main(nit) {
        try {
            const { data, error } = await this.redemptionsService.findTransactionsByCustomer(nit);
            if (data.transactions.length === 0) {
                return new response_api_commons_1.ApiResponse(false, data, 'No se encontro información del cliente !');
            }
            const { responseTransaction } = this.parseData(data);
            return new response_api_commons_1.ApiResponse(true, responseTransaction, 'Datos encontrados !');
        }
        catch (error) {
            return new response_api_commons_1.ApiResponse(false, null, 'Error al consultar la información de las transacciones !', [error.message]);
        }
    }
    parseData(data) {
        let responseTransaction = {
            transactions: [],
            totalPointsReeedemed: 0,
        };
        for (const transaction of data.transactions) {
            responseTransaction.transactions.push(transaction);
            responseTransaction.totalPointsReeedemed += transaction.redemption_points;
        }
        return { responseTransaction };
    }
};
TransactionsHistoryUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redemptions_service_1.RedemptionsService])
], TransactionsHistoryUseCase);
exports.TransactionsHistoryUseCase = TransactionsHistoryUseCase;
//# sourceMappingURL=get-transactions-history.use-case.js.map