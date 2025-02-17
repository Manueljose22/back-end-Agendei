import { Router } from "express";
import AddAdminControllers from "../controllers/admin/AddAdminControllers";
import DeleteAdminControllers from "../controllers/admin/DeleteAdminControllers";
import { ensuredAuthenticated } from "../middlewares/auth/ensuredAuthenticated";
import GetAdminByIdControllers from "../controllers/admin/GetAdminByIdControllers";
import ListAdminController from "../controllers/admin/ListAdminController";
import ProfileAdminControllers from "../controllers/admin/ProfileAdminControllers";
import UpdateAdminControllers from "../controllers/admin/UpdateAdminControllers";
import ListAppointmentByIdControllers from "../controllers/appointments/ListAppointmentByIdControllers";
import CreateAppointmentsControllers from "../controllers/appointments/CreateAppointmentsControllers";




const router = Router();


// Usur admin
router.get('/admin/profile', ensuredAuthenticated, ProfileAdminControllers.handle);
router.get('/admin/', ensuredAuthenticated, ListAdminController.handle);
router.post('/admin/register', AddAdminControllers.handle);
router.get('/admin/:id', ensuredAuthenticated, GetAdminByIdControllers.handle);
router.put('/admin/:id', ensuredAuthenticated, UpdateAdminControllers.handle);
router.delete('/admin/:id', ensuredAuthenticated, DeleteAdminControllers.handle);

// management appointm
router.post('/admin/appointments/register', ensuredAuthenticated, CreateAppointmentsControllers.handle);
router.get('/admin/appointments/:id', ensuredAuthenticated, ListAppointmentByIdControllers.handle);



export { router as adminsRoutes }