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
exports.RedemptionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const redemption_entity_1 = require("./entities/redemption.entity");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("../customers/entities/customer.entity");
let RedemptionsService = class RedemptionsService {
    constructor(redemptionRepository, customerRepository) {
        this.redemptionRepository = redemptionRepository;
        this.customerRepository = customerRepository;
    }
    async create(customerId, pointsToRedeem) {
        try {
            const newRedemption = this.redemptionRepository.create({
                customer_id: customerId,
                points: pointsToRedeem,
            });
            const _redeemed = await this.redemptionRepository.save(newRedemption);
            return {
                data: {
                    redeemed: _redeemed,
                },
            };
        }
        catch (error) {
            return {
                error: true,
                data: error.message,
            };
        }
    }
    async findTransactionsByCustomer(nit) {
        try {
            const _transactios = await this.customerRepository
                .createQueryBuilder('customer')
                .innerJoinAndSelect('customer.redemptions', 'redemption')
                .where('customer.nit = :nit', { nit })
                .getRawMany();
            return {
                data: {
                    transactions: _transactios,
                },
            };
        }
        catch (error) {
            return {
                error: true,
                data: error.message,
            };
        }
    }
};
RedemptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(redemption_entity_1.Redemptions)),
    __param(1, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RedemptionsService);
exports.RedemptionsService = RedemptionsService;
//# sourceMappingURL=redemptions.service.js.map