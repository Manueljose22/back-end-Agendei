import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/auth/ensuredAuthenticated";
import ListAppointmentsControllers from "../controllers/appointments/ListAppointmentsControllers";
import AddAppointmentsControllers from "../controllers/appointments/AddAppointmentsControllers";
import UpdateAppointmentsControllers from "../controllers/appointments/UpdateAppointmentsControllers";
import ListAppointmentByPatientsControllers from "../controllers/appointments/ListAppointmentByPatientsControllers";
import CancelAppointmentsControllers from "../controllers/appointments/CancelAppointmentsControllers";





const router = Router();

// web
router.get('/appointments/', ensuredAuthenticated, ListAppointmentsControllers.handle);

// router mobile
router.get('/appointments/all', ensuredAuthenticated, ListAppointmentByPatientsControllers.handle);
router.post('/appointments/', ensuredAuthenticated, AddAppointmentsControllers.handle);
router.put('/appointments/:id', ensuredAuthenticated, UpdateAppointmentsControllers.handle);
router.put('/appointments/cancel/:id', ensuredAuthenticated, CancelAppointmentsControllers.handle);







export { router as appointmentsRoutes }

