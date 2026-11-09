"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const ensureRateLimiter = (time, max = 5) => (0, express_rate_limit_1.default)({
    windowMs: time * 60 * 1000,
    max: max,
    message: {
        message: `Muitas tentativas. Tente novamente em ${time} minutos.`
    }
});
exports.ensureRateLimiter = ensureRateLimiter;
