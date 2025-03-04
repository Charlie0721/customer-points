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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const customer_entity_1 = require("./entities/customer.entity");
const typeorm_2 = require("typeorm");
const customer_points_entity_1 = require("./entities/customer-points.entity");
const customer_points_kardex_1 = require("./entities/customer-points-kardex");
let CustomersService = class CustomersService {
    constructor(customerRepository, customerPointsRepository, customerPointsKardexRepository) {
        this.customerRepository = customerRepository;
        this.customerPointsRepository = customerPointsRepository;
        this.customerPointsKardexRepository = customerPointsKardexRepository;
    }
    async create(nit, name, points, expirationDays) {
        this.queryRunner =
            this.customerRepository.manager.connection.createQueryRunner();
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();
        try {
            const newCustomer = this.queryRunner.manager.create(customer_entity_1.Customer, {
                nit,
                name,
            });
            const savedCustomer = await this.queryRunner.manager.save(newCustomer);
            const savedCustomerPoints = await this.saveCustomerPoints(this.queryRunner, savedCustomer.id, points, expirationDays);
            await this.queryRunner.commitTransaction();
            return {
                data: {
                    savedCustomer,
                    savedCustomerPoints,
                },
            };
        }
        catch (error) {
            if (this.queryRunner.isTransactionActive) {
                await this.queryRunner.rollbackTransaction();
            }
            return {
                data: error.message,
                error: true,
            };
        }
        finally {
            await this.queryRunner.release();
        }
    }
    async saveCustomerPoints(queryRunner, customerId, points, expirationDays) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + expirationDays);
        const newCustomerPoints = queryRunner.manager.create(customer_points_entity_1.CustomerPoints, {
            customer_id: customerId,
            points: points,
            expiration_date: expirationDate,
        });
        const savedCustomerPoints = await queryRunner.manager.save(newCustomerPoints);
        return savedCustomerPoints;
    }
    async findOne(nit) {
        try {
            const customerFound = await this.customerRepository.findOne({
                where: { nit },
            });
            return {
                data: customerFound,
            };
        }
        catch (error) {
            return {
                error: true,
                data: error.message,
            };
        }
    }
    async findPointsByCustomerId(customerId) {
        try {
            const customerPoints = await this.customerPointsRepository.findOne({
                where: { customer_id: customerId },
            });
            return {
                data: customerPoints,
            };
        }
        catch (error) {
            return {
                error: true,
                data: error.message,
            };
        }
    }
    async updatePoints(id, totalPoints, expirationDate) {
        try {
            const customerPoints = await this.customerPointsRepository.update(id, {
                points: totalPoints,
                expiration_date: expirationDate,
            });
            return {
                data: {
                    customerPoints,
                    id,
                    totalPoints,
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
    async findPointsByCustomer(nit) {
        try {
            const _pointsByCustomer = await this.customerRepository
                .createQueryBuilder('customer')
                .leftJoinAndSelect('customer.customerPoints', 'customerPoints')
                .select([
                'customer.id as id',
                'customer.name as name',
                'customer.nit as nit',
                'customerPoints.points as total_points',
            ])
                .where('customer.nit = :nit', { nit })
                .getRawOne();
            return {
                data: _pointsByCustomer,
            };
        }
        catch (error) {
            return {
                error: true,
                data: error.message,
            };
        }
    }
    async createKardex(kardexEntry) {
        const newKardexEntry = this.customerPointsKardexRepository.create(kardexEntry);
        return this.customerPointsKardexRepository.save(newKardexEntry);
    }
};
CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __param(1, (0, typeorm_1.InjectRepository)(customer_points_entity_1.CustomerPoints)),
    __param(2, (0, typeorm_1.InjectRepository)(customer_points_kardex_1.CustomerPointsKardex)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CustomersService);
exports.CustomersService = CustomersService;
//# sourceMappingURL=customers.service.js.map