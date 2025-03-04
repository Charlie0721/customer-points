"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedemptionsModule = void 0;
const common_1 = require("@nestjs/common");
const redemptions_service_1 = require("./redemptions.service");
const redemptions_controller_1 = require("./redemptions.controller");
const typeorm_1 = require("@nestjs/typeorm");
const customer_entity_1 = require("../customers/entities/customer.entity");
const redemption_entity_1 = require("./entities/redemption.entity");
const create_redemptions_use_case_1 = require("./use-cases/create-redemptions.use-case");
const find_customer_use_case_1 = require("../customers/use-cases/find-customer.use-case");
const customers_module_1 = require("../customers/customers.module");
const get_transactions_history_use_case_1 = require("./use-cases/get-transactions-history.use-case");
let RedemptionsModule = class RedemptionsModule {
};
RedemptionsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([customer_entity_1.Customer, redemption_entity_1.Redemptions]), customers_module_1.CustomersModule],
        controllers: [redemptions_controller_1.RedemptionsController],
        providers: [
            redemptions_service_1.RedemptionsService,
            create_redemptions_use_case_1.CreatePointsRedemptionUseCase,
            find_customer_use_case_1.FindCustomerUseCase,
            get_transactions_history_use_case_1.TransactionsHistoryUseCase,
        ],
    })
], RedemptionsModule);
exports.RedemptionsModule = RedemptionsModule;
//# sourceMappingURL=redemptions.module.js.map