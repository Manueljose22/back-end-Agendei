"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentsRoutes = void 0;
const express_1 = require("express");
const ensuredAuthenticated_1 = require("../middlewares/auth/ensuredAuthenticated");
const ListAppointmentsControllers_1 = __importDefault(require("../controllers/appointments/ListAppointmentsControllers"));
const AddAppointmentsControllers_1 = __importDefault(require("../controllers/appointments/AddAppointmentsControllers"));
const UpdateAppointmentsControllers_1 = __importDefault(require("../controllers/appointments/UpdateAppointmentsControllers"));
const ListAppointmentByPatientsControllers_1 = __importDefault(require("../controllers/appointments/ListAppointmentByPatientsControllers"));
const CancelAppointmentsControllers_1 = __importDefault(require("../controllers/appointments/CancelAppointmentsControllers"));
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = (0, express_1.Router)();
exports.appointmentsRoutes = router;
// web
router.get('/appointments', ensuredAuthenticated_1.ensuredAuthenticated, (0, rateLimiter_1.ensureRateLimiter)(1, 100), ListAppointmentsControllers_1.default.handle);
// router mobile
router.get('/appointments/all', ensuredAuthenticated_1.ensuredAuthenticated, (0, rateLimiter_1.ensureRateLimiter)(1, 100), ListAppointmentByPatientsControllers_1.default.handle);
router.post('/appointments/', ensuredAuthenticated_1.ensuredAuthenticated, AddAppointmentsControllers_1.default.handle);
router.put('/appointments/:id', ensuredAuthenticated_1.ensuredAuthenticated, UpdateAppointmentsControllers_1.default.handle);
router.put('/appointments/cancel/:id', ensuredAuthenticated_1.ensuredAuthenticated, (0, rateLimiter_1.ensureRateLimiter)(10, 10), CancelAppointmentsControllers_1.default.handle);
