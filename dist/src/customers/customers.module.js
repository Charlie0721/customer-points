"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersModule = void 0;
const common_1 = require("@nestjs/common");
const customers_service_1 = require("./customers.service");
const customers_controller_1 = require("./customers.controller");
const typeorm_1 = require("@nestjs/typeorm");
const customer_entity_1 = require("./entities/customer.entity");
const customer_points_entity_1 = require("./entities/customer-points.entity");
const redemption_entity_1 = require("../redemptions/entities/redemption.entity");
const create_customer_use_case_1 = require("./use-cases/create-customer.use-case");
const update_customer_points_use_case_1 = require("./use-cases/update-customer-points.use-case");
const find_customer_use_case_1 = require("./use-cases/find-customer.use-case");
const find_points_by_customer_use_case_1 = require("./use-cases/find-points-by-customer.use-case");
const customer_points_kardex_1 = require("./entities/customer-points-kardex");
let CustomersModule = class CustomersModule {
};
CustomersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                customer_entity_1.Customer,
                customer_points_entity_1.CustomerPoints,
                redemption_entity_1.Redemptions,
                customer_points_kardex_1.CustomerPointsKardex,
            ]),
        ],
        controllers: [customers_controller_1.CustomersController],
        providers: [
            customers_service_1.CustomersService,
            create_customer_use_case_1.CreateCustomerUseCase,
            update_customer_points_use_case_1.UpdatePointsUseCase,
            find_customer_use_case_1.FindCustomerUseCase,
            find_points_by_customer_use_case_1.FindPointByCustomerUseCase,
        ],
        exports: [customers_service_1.CustomersService],
    })
], CustomersModule);
exports.CustomersModule = CustomersModule;
//# sourceMappingURL=customers.module.js.map