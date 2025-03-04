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
exports.CreateCustomerUseCase = void 0;
const common_1 = require("@nestjs/common");
const customers_service_1 = require("../customers.service");
const response_api_commons_1 = require("../../commons/response-api.commons");
let CreateCustomerUseCase = class CreateCustomerUseCase {
    constructor(customersService) {
        this.customersService = customersService;
    }
    async main(nit, name, points, expirationDays) {
        try {
            const { error, data } = await this.customersService.create(nit, name, points, expirationDays);
            const expirationDate = this.calculateExpirationDate(expirationDays);
            await this.registerKardexEntry(data.savedCustomer.id, 0, points, points, 'acquisition', expirationDate);
            return new response_api_commons_1.ApiResponse(true, data, 'Cliente creado exitosamente');
        }
        catch (error) {
            return new response_api_commons_1.ApiResponse(false, null, 'Error al crear cliente', [
                error.message,
            ]);
        }
    }
    calculateExpirationDate(expirationDays) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + expirationDays);
        return currentDate;
    }
    async registerKardexEntry(customerId, previousPoints, newPoints, points, transactionType, expirationDate) {
        const difference = newPoints - previousPoints;
        const kardexEntry = {
            customer_id: customerId,
            previous_points: previousPoints,
            new_points: newPoints,
            difference: difference,
            reason: `Puntos ${transactionType}`,
            transaction_type: transactionType,
            expiration_date: expirationDate,
        };
        await this.customersService.createKardex(kardexEntry);
    }
};
CreateCustomerUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], CreateCustomerUseCase);
exports.CreateCustomerUseCase = CreateCustomerUseCase;
//# sourceMappingURL=create-customer.use-case.js.map