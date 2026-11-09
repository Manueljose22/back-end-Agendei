"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminsRoutes = void 0;
const express_1 = require("express");
const GetAdminByIdControllers_1 = __importDefault(require("../controllers/admin/GetAdminByIdControllers"));
const ListAdminController_1 = __importDefault(require("../controllers/admin/ListAdminController"));
const ProfileAdminControllers_1 = __importDefault(require("../controllers/admin/ProfileAdminControllers"));
const UpdateAdminControllers_1 = __importDefault(require("../controllers/admin/UpdateAdminControllers"));
const ListAppointmentByIdControllers_1 = __importDefault(require("../controllers/appointments/ListAppointmentByIdControllers"));
const CreateAppointmentsControllers_1 = __importDefault(require("../controllers/appointments/CreateAppointmentsControllers"));
const ensureSupabaseAuthenticated_1 = require("../middlewares/auth/ensureSupabaseAuthenticated");
const requireRole_1 = require("../middlewares/auth/requireRole");
const router = (0, express_1.Router)();
exports.adminsRoutes = router;
const adminOnly = [ensureSupabaseAuthenticated_1.ensureSupabaseAuthenticated, (0, requireRole_1.requireRole)("admin")];
// Não existe registo público de administradores. O primeiro acesso é criado
// exclusivamente pelo script seguro de bootstrap no servidor.
router.get("/admin/profile", ...adminOnly, ProfileAdminControllers_1.default.handle);
router.get("/admin/", ...adminOnly, ListAdminController_1.default.handle);
router.get("/admin/:id", ...adminOnly, GetAdminByIdControllers_1.default.handle);
router.put("/admin/:id", ...adminOnly, UpdateAdminControllers_1.default.handle);
router.post("/admin/appointments/register", ...adminOnly, CreateAppointmentsControllers_1.default.handle);
router.get("/admin/appointments/:id", ...adminOnly, ListAppointmentByIdControllers_1.default.handle);
