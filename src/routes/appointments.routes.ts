import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/auth/ensuredAuthenticated";
import ListAppointmentsControllers from "../controllers/appointments/ListAppointmentsControllers";
import AddAppointmentsControllers from "../controllers/appointments/AddAppointmentsControllers";
import UpdateAppointmentsControllers from "../controllers/appointments/UpdateAppointmentsControllers";
import ListAppointmentByPatientsControllers from "../controllers/appointments/ListAppointmentByPatientsControllers";
import CancelAppointmentsControllers from "../controllers/appointments/CancelAppointmentsControllers";
import { ensureRateLimiter } from "../middlewares/rateLimiter";





const router = Router();

// web
router.get('/appointments', ensuredAuthenticated,ensureRateLimiter(1, 100), ListAppointmentsControllers.handle);

// router mobile
router.get('/appointments/all', ensuredAuthenticated,ensureRateLimiter(1, 100), ListAppointmentByPatientsControllers.handle);
router.post('/appointments/', ensuredAuthenticated, AddAppointmentsControllers.handle);
router.put('/appointments/:id', ensuredAuthenticated, UpdateAppointmentsControllers.handle);
router.put('/appointments/cancel/:id', ensuredAuthenticated, ensureRateLimiter(10, 10), CancelAppointmentsControllers.handle);







export { router as appointmentsRoutes }

