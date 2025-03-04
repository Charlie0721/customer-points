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
exports.CreatePointsRedemptionUseCase = void 0;
const common_1 = require("@nestjs/common");
const redemptions_service_1 = require("../redemptions.service");
const response_api_commons_1 = require("../../commons/response-api.commons");
const customers_service_1 = require("../../customers/customers.service");
let CreatePointsRedemptionUseCase = class CreatePointsRedemptionUseCase {
    constructor(redemptionsService, customersService) {
        this.redemptionsService = redemptionsService;
        this.customersService = customersService;
    }
    async main(customerId, pointsToRedeem) {
        try {
            const customerPoints = await this.searchCustomerPoints(customerId);
            const validPoints = customerPoints.filter((point) => {
                const expirationDate = new Date(point.expiration_date);
                const today = new Date();
                return expirationDate >= today;
            });
            const totalValidPoints = validPoints.reduce((sum, point) => sum + point.points, 0);
            if (totalValidPoints < pointsToRedeem) {
                return new response_api_commons_1.ApiResponse(false, null, `Puntos insuficientes. Disponibles: ${totalValidPoints}`);
            }
            let remainingPointsToRedeem = pointsToRedeem;
            const sortedPoints = this.sortPointsByExpiration(validPoints);
            for (const point of sortedPoints) {
                if (remainingPointsToRedeem <= 0)
                    break;
                const pointsAvailable = point.points;
                const pointsToDeduct = Math.min(remainingPointsToRedeem, pointsAvailable);
                await this.customersService.updatePoints(point.id, pointsAvailable - pointsToDeduct, point.expiration_date);
                await this.registerKardexEntry(customerId, pointsAvailable, pointsAvailable - pointsToDeduct, pointsToDeduct, 'redemption', point.expiration_date);
                remainingPointsToRedeem -= pointsToDeduct;
            }
            const { data } = await this.redemptionsService.create(customerId, pointsToRedeem);
            return new response_api_commons_1.ApiResponse(true, data, 'Redención realizada exitosamente');
        }
        catch (error) {
            return new response_api_commons_1.ApiResponse(false, null, 'Error al redimir puntos', [
                error.message,
            ]);
        }
    }
    async searchCustomerPoints(customerId) {
        const { data } = await this.customersService.findPointsByCustomerId(customerId);
        return Array.isArray(data) ? data : [data];
    }
    sortPointsByExpiration(points) {
        return points.sort((a, b) => new Date(a.expiration_date).getTime() -
            new Date(b.expiration_date).getTime());
    }
    async registerKardexEntry(customerId, previousPoints, newPoints, pointsUsed, transactionType, expirationDate) {
        const kardexEntry = {
            customer_id: customerId,
            previous_points: previousPoints,
            new_points: newPoints,
            difference: newPoints - previousPoints,
            reason: `Redención de ${pointsUsed} puntos`,
            transaction_type: transactionType,
            expiration_date: expirationDate,
        };
        await this.customersService.createKardex(kardexEntry);
    }
};
CreatePointsRedemptionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redemptions_service_1.RedemptionsService,
        customers_service_1.CustomersService])
], CreatePointsRedemptionUseCase);
exports.CreatePointsRedemptionUseCase = CreatePointsRedemptionUseCase;
//# sourceMappingURL=create-redemptions.use-case.js.map