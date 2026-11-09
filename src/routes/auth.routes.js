"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const AuthControllers_1 = __importDefault(require("../controllers/auth/AuthControllers"));
const rateLimiter_1 = require("../middlewares/rateLimiter");
const ensureSupabaseAuthenticated_1 = require("../middlewares/auth/ensureSupabaseAuthenticated");
const router = (0, express_1.Router)();
exports.authRoutes = router;
router.post("/auth/patients/register", (0, rateLimiter_1.ensureRateLimiter)(15, 5), AuthControllers_1.default.registerPatient);
router.post("/auth/login", (0, rateLimiter_1.ensureRateLimiter)(15, 10), AuthControllers_1.default.login);
router.post("/auth/password/reset", (0, rateLimiter_1.ensureRateLimiter)(60, 3), AuthControllers_1.default.requestPasswordReset);
router.get("/auth/me", ensureSupabaseAuthenticated_1.ensureSupabaseAuthenticated, AuthControllers_1.default.me);
