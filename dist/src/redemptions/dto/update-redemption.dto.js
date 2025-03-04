"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRedemptionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_redemption_dto_1 = require("./create-redemption.dto");
class UpdateRedemptionDto extends (0, mapped_types_1.PartialType)(create_redemption_dto_1.CreateRedemptionDto) {
}
exports.UpdateRedemptionDto = UpdateRedemptionDto;
//# sourceMappingURL=update-redemption.dto.js.map