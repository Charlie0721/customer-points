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
exports.Customer = void 0;
const typeorm_1 = require("typeorm");
const customer_points_entity_1 = require("./customer-points.entity");
const redemption_entity_1 = require("../../redemptions/entities/redemption.entity");
const customer_points_kardex_1 = require("./customer-points-kardex");
let Customer = class Customer {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Customer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Customer.prototype, "nit", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customer.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Customer.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Customer.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_points_entity_1.CustomerPoints, (points) => points.customer),
    __metadata("design:type", Array)
], Customer.prototype, "customerPoints", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => redemption_entity_1.Redemptions, (redemption) => redemption.customer),
    __metadata("design:type", Array)
], Customer.prototype, "redemptions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_points_kardex_1.CustomerPointsKardex, (kardexEntry) => kardexEntry.customer),
    __metadata("design:type", Array)
], Customer.prototype, "kardexEntries", void 0);
Customer = __decorate([
    (0, typeorm_1.Entity)('customers')
], Customer);
exports.Customer = Customer;
//# sourceMappingURL=customer.entity.js.map