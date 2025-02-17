import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/auth/ensuredAuthenticated";
import ListAppointmentByUserControllers from "../controllers/appointments/ListAppointmentByUserControllers";
import ListAppointmentsControllers from "../controllers/appointments/ListAppointmentsControllers";
import AddAppointmentsControllers from "../controllers/appointments/AddAppointmentsControllers";
import DeleteAppointmentsControllers from "../controllers/appointments/DeleteAppointmentsControllers";
import UpdateAppointmentsControllers from "../controllers/appointments/UpdateAppointmentsControllers";





const router = Router();

// web
router.get('/appointments/', ensuredAuthenticated, ListAppointmentsControllers.handle);

// router mobile
router.get('/appointments/all', ensuredAuthenticated, ListAppointmentByUserControllers.handle);
router.post('/appointments/register', ensuredAuthenticated, AddAppointmentsControllers.handle);
router.put('/appointments/:id', ensuredAuthenticated, UpdateAppointmentsControllers.handle);
router.delete('/appointments/:id', ensuredAuthenticated, DeleteAppointmentsControllers.handle);







export { router as appointmentsRoutes }

