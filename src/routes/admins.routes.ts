import { Router } from "express";
import DeleteAdminControllers from "../controllers/admin/DeleteAdminControllers";
import GetAdminByIdControllers from "../controllers/admin/GetAdminByIdControllers";
import ListAdminController from "../controllers/admin/ListAdminController";
import ProfileAdminControllers from "../controllers/admin/ProfileAdminControllers";
import UpdateAdminControllers from "../controllers/admin/UpdateAdminControllers";
import ListAppointmentByIdControllers from "../controllers/appointments/ListAppointmentByIdControllers";
import CreateAppointmentsControllers from "../controllers/appointments/CreateAppointmentsControllers";
import { ensureSupabaseAuthenticated } from "../middlewares/auth/ensureSupabaseAuthenticated";
import { requireRole } from "../middlewares/auth/requireRole";

const router = Router();
const adminOnly = [ensureSupabaseAuthenticated, requireRole("admin")];

// Não existe registo público de administradores. O primeiro acesso é criado
// exclusivamente pelo script seguro de bootstrap no servidor.
router.get("/admin/profile", ...adminOnly, ProfileAdminControllers.handle);
router.get("/admin/", ...adminOnly, ListAdminController.handle);
router.get("/admin/:id", ...adminOnly, GetAdminByIdControllers.handle);
router.put("/admin/:id", ...adminOnly, UpdateAdminControllers.handle);
router.delete("/admin/:id", ...adminOnly, DeleteAdminControllers.handle);

router.post("/admin/appointments/register", ...adminOnly, CreateAppointmentsControllers.handle);
router.get("/admin/appointments/:id", ...adminOnly, ListAppointmentByIdControllers.handle);

export { router as adminsRoutes };
