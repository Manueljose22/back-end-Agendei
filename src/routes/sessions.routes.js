"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionsRoutes = void 0;
const express_1 = require("express");
const SessionsControllers_1 = __importDefault(require("../controllers/sessions/SessionsControllers"));
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = (0, express_1.Router)();
exports.sessionsRoutes = router;
router.post("/session/login", (0, rateLimiter_1.ensureRateLimiter)(10), SessionsControllers_1.default.handle);
