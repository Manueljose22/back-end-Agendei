"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesRoutes = void 0;
const express_1 = require("express");
const ensuredAuthenticated_1 = require("../middlewares/auth/ensuredAuthenticated");
const GetAllServicesController_1 = __importDefault(require("../controllers/service/GetAllServicesController"));
const CreateServicesController_1 = __importDefault(require("../controllers/service/CreateServicesController"));
const GetByIdServicesController_1 = __importDefault(require("../controllers/service/GetByIdServicesController"));
const UpdateServicesController_1 = __importDefault(require("../controllers/service/UpdateServicesController"));
const DeleteServicesController_1 = __importDefault(require("../controllers/service/DeleteServicesController"));
const GetAllServicesHospitalController_1 = __importDefault(require("../controllers/service/GetAllServicesHospitalController"));
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = (0, express_1.Router)();
exports.ServicesRoutes = router;
router.get('/services/', ensuredAuthenticated_1.ensuredAuthenticated, (0, rateLimiter_1.ensureRateLimiter)(1, 100), GetAllServicesController_1.default.handle);
router.post('/services', ensuredAuthenticated_1.ensuredAuthenticated, (0, rateLimiter_1.ensureRateLimiter)(1, 100), CreateServicesController_1.default.handle);
router.get('/services/:id', ensuredAuthenticated_1.ensuredAuthenticated, (0, rateLimiter_1.ensureRateLimiter)(1, 30), GetByIdServicesController_1.default.handle);
router.put('/services/:id', ensuredAuthenticated_1.ensuredAuthenticated, (0, rateLimiter_1.ensureRateLimiter)(1, 30), UpdateServicesController_1.default.handle);
router.delete('/services/:id', ensuredAuthenticated_1.ensuredAuthenticated, (0, rateLimiter_1.ensureRateLimiter)(1, 30), DeleteServicesController_1.default.handle);
// web
router.get("/hospital/services", ensuredAuthenticated_1.ensuredAuthenticated, GetAllServicesHospitalController_1.default.handle);
