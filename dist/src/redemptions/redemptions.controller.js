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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedemptionsController = void 0;
const common_1 = require("@nestjs/common");
const create_redemption_dto_1 = require("./dto/create-redemption.dto");
const create_redemptions_use_case_1 = require("./use-cases/create-redemptions.use-case");
const swagger_1 = require("@nestjs/swagger");
const find_customer_use_case_1 = require("../customers/use-cases/find-customer.use-case");
const get_transactions_history_use_case_1 = require("./use-cases/get-transactions-history.use-case");
let RedemptionsController = class RedemptionsController {
    constructor(createPointsRedemptionUseCase, findCustomerUseCase, transactionsHistoryUseCase) {
        this.createPointsRedemptionUseCase = createPointsRedemptionUseCase;
        this.findCustomerUseCase = findCustomerUseCase;
        this.transactionsHistoryUseCase = transactionsHistoryUseCase;
    }
    async create(res, createRedemptionDto) {
        const { nit, pointsToRedeem } = createRedemptionDto;
        const normalizedNit = nit.trim();
        const { data: customer, message: customer_message, errors: errors1, success: success1, } = await this.findCustomerUseCase.main(normalizedNit);
        if (customer === null && customer_message === 'Cliente no encontrado') {
            return res
                .status(common_1.HttpStatus.NOT_FOUND)
                .send({ success1, customer, customer_message });
        }
        if (customer_message === 'Cliente encontrado exitosamente') {
            const { success, data, message, errors } = await this.createPointsRedemptionUseCase.main(customer.id, pointsToRedeem);
            if (success) {
                return res.status(common_1.HttpStatus.CREATED).send({ success, data, message });
            }
            else {
                return res
                    .status(common_1.HttpStatus.BAD_REQUEST)
                    .send({ success, message, errors });
            }
        }
    }
    async transactionsHistory(res, nit) {
        const normalizedNit = nit.trim();
        const { data, message, errors, success } = await this.transactionsHistoryUseCase.main(normalizedNit);
        if (message === 'No se encontro información del cliente !') {
            return res.status(common_1.HttpStatus.NOT_FOUND).send({ success, data, message });
        }
        if (message === 'Datos encontrados !') {
            if (success) {
                return res.status(common_1.HttpStatus.OK).send({ success, data, message });
            }
            else {
                return res
                    .status(common_1.HttpStatus.BAD_REQUEST)
                    .send({ success, message, errors });
            }
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Endpoint encargado de redimir los puntos por cliente',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Endpoint encargado de redimir los puntos por cliente',
        type: create_redemption_dto_1.CreateRedemptionDto,
    }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_redemption_dto_1.CreateRedemptionDto]),
    __metadata("design:returntype", Promise)
], RedemptionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('transactions/:nit'),
    (0, swagger_1.ApiOperation)({
        summary: 'Consultar el historico de transacciones por cliente',
    }),
    (0, swagger_1.ApiParam)({
        name: 'nit',
        description: 'Nit del cliente',
        required: true,
    }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)('nit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RedemptionsController.prototype, "transactionsHistory", null);
RedemptionsController = __decorate([
    (0, swagger_1.ApiTags)('Redemptions'),
    (0, common_1.Controller)('redemptions'),
    __metadata("design:paramtypes", [create_redemptions_use_case_1.CreatePointsRedemptionUseCase,
        find_customer_use_case_1.FindCustomerUseCase,
        get_transactions_history_use_case_1.TransactionsHistoryUseCase])
], RedemptionsController);
exports.RedemptionsController = RedemptionsController;
//# sourceMappingURL=redemptions.controller.js.map