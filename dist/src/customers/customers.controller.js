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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const create_customer_dto_1 = require("./dto/create-customer.dto");
const swagger_1 = require("@nestjs/swagger");
const create_customer_use_case_1 = require("./use-cases/create-customer.use-case");
const find_customer_use_case_1 = require("./use-cases/find-customer.use-case");
const update_customer_points_use_case_1 = require("./use-cases/update-customer-points.use-case");
const find_points_by_customer_use_case_1 = require("./use-cases/find-points-by-customer.use-case");
let CustomersController = class CustomersController {
    constructor(createCustomerUseCase, findCustomerUseCase, updatePointsUseCase, findPointByCustomerUseCase) {
        this.createCustomerUseCase = createCustomerUseCase;
        this.findCustomerUseCase = findCustomerUseCase;
        this.updatePointsUseCase = updatePointsUseCase;
        this.findPointByCustomerUseCase = findPointByCustomerUseCase;
    }
    async create(response, createCustomerDto) {
        const { nit, name, points, expiration_days } = createCustomerDto;
        const normalizedNit = nit.trim();
        const { data: customer, message: customer_message, errors: errors1, success: success1, } = await this.findCustomerUseCase.main(normalizedNit);
        if (customer_message === 'Cliente encontrado exitosamente') {
            const { success, data, message, errors } = await this.updatePointsUseCase.main(customer.id, points, expiration_days);
            if (success) {
                return response.status(common_1.HttpStatus.OK).send({ success, data, message });
            }
            else {
                return response
                    .status(common_1.HttpStatus.BAD_REQUEST)
                    .send({ success, message, errors });
            }
        }
        if (customer === null) {
            const { success, data, message, errors } = await this.createCustomerUseCase.main(nit, name, points, expiration_days);
            if (success) {
                return response
                    .status(common_1.HttpStatus.CREATED)
                    .send({ success, data, message });
            }
            else {
                return response
                    .status(common_1.HttpStatus.BAD_REQUEST)
                    .send({ success, message, errors });
            }
        }
    }
    async findTotalPointsByCustomer(res, nit) {
        const { success, data, message, errors } = await this.findPointByCustomerUseCase.main(nit);
        if (message === 'Cliente encontrado exitosamente') {
            if (success) {
                return res.status(common_1.HttpStatus.OK).send({ success, data, message });
            }
            else {
                return res
                    .status(common_1.HttpStatus.NOT_FOUND)
                    .send({ success, message, errors });
            }
        }
        else {
            return res
                .status(common_1.HttpStatus.NOT_FOUND)
                .send({ success, message, errors });
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Crear clientes y/o actualizar puntos si ya existe',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Crear clientes, puntaje inicial o actualizar puntaje ',
        type: create_customer_dto_1.CreateCustomerDto,
    }),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_customer_dto_1.CreateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':nit'),
    (0, swagger_1.ApiOperation)({
        summary: 'Consultar el total de puntos por cliente',
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
], CustomersController.prototype, "findTotalPointsByCustomer", null);
CustomersController = __decorate([
    (0, swagger_1.ApiTags)('Customers'),
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [create_customer_use_case_1.CreateCustomerUseCase,
        find_customer_use_case_1.FindCustomerUseCase,
        update_customer_points_use_case_1.UpdatePointsUseCase,
        find_points_by_customer_use_case_1.FindPointByCustomerUseCase])
], CustomersController);
exports.CustomersController = CustomersController;
//# sourceMappingURL=customers.controller.js.map