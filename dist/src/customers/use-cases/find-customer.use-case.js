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
exports.FindCustomerUseCase = void 0;
const common_1 = require("@nestjs/common");
const customers_service_1 = require("../customers.service");
const response_api_commons_1 = require("../../commons/response-api.commons");
let FindCustomerUseCase = class FindCustomerUseCase {
    constructor(customersService) {
        this.customersService = customersService;
    }
    async main(nit) {
        try {
            const { data, error } = await this.customersService.findOne(nit);
            if (!data) {
                return new response_api_commons_1.ApiResponse(false, null, 'Cliente no encontrado');
            }
            return new response_api_commons_1.ApiResponse(true, data, 'Cliente encontrado exitosamente');
        }
        catch (error) {
            return new response_api_commons_1.ApiResponse(false, null, 'Error al buscar cliente', [
                error.message,
            ]);
        }
    }
};
FindCustomerUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], FindCustomerUseCase);
exports.FindCustomerUseCase = FindCustomerUseCase;
//# sourceMappingURL=find-customer.use-case.js.map