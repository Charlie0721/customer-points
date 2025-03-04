"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(success, data, message, errors = []) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.errors = errors;
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=response-api.commons.js.map