import { Router } from "express";
import GetAdminByIdControllers from "../controllers/admin/GetAdminByIdControllers";
import ListAdminController from "../controllers/admin/ListAdminController";
import ProfileAdminControllers from "../controllers/admin/ProfileAdminControllers";
import UpdateAdminControllers from "../controllers/admin/UpdateAdminControllers";
import ListAppointmentByIdControllers from "../controllers/appointments/ListAppointmentByIdControllers";
import CreateAppointmentsControllers from "../controllers/appointments/CreateAppointmentsControllers";
import { ensureAdminAuthenticated } from "../middlewares/auth/ensureAdminAuthenticated";

const router = Router();
const adminOnly = [ensureAdminAuthenticated];

router.get("/admin/profile", ...adminOnly, ProfileAdminControllers.handle);
router.get("/admin/", ...adminOnly, ListAdminController.handle);
router.get("/admin/:id", ...adminOnly, GetAdminByIdControllers.handle);
router.put("/admin/:id", ...adminOnly, UpdateAdminControllers.handle);
router.post("/admin/appointments/register", ...adminOnly, CreateAppointmentsControllers.handle);
router.get("/admin/appointments/:id", ...adminOnly, ListAppointmentByIdControllers.handle);

export { router as adminsRoutes };
