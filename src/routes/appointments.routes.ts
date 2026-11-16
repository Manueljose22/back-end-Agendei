import { Router } from "express";
import { ensureRole } from "../middlewares/auth/ensureRole";
import { ensureActiveHospital } from "../middlewares/auth/ensureActiveHospital";
import ListAppointmentsControllers from "../controllers/appointments/ListAppointmentsControllers";
import AddAppointmentsControllers from "../controllers/appointments/AddAppointmentsControllers";
import UpdateAppointmentsControllers from "../controllers/appointments/UpdateAppointmentsControllers";
import ListAppointmentByPatientsControllers from "../controllers/appointments/ListAppointmentByPatientsControllers";
import CancelAppointmentsControllers from "../controllers/appointments/CancelAppointmentsControllers";
import { ensureRateLimiter } from "../middlewares/rateLimiter";

const router = Router();

router.get(
  "/appointments",
  ensureRole("platform_admin", "hospital", "doctor"),
  ensureActiveHospital,
  ensureRateLimiter(1, 100),
  ListAppointmentsControllers.handle
);

router.get(
  "/appointments/all",
  ensureRole("patient"),
  ensureRateLimiter(1, 100),
  ListAppointmentByPatientsControllers.handle
);

router.post(
  "/appointments/",
  ensureRole("patient"),
  AddAppointmentsControllers.handle
);

router.patch(
  "/appointments/:id",
  ensureRole("platform_admin", "hospital", "doctor", "patient"),
  ensureActiveHospital,
  UpdateAppointmentsControllers.handle
);

router.patch(
  "/appointments/cancel/:id",
  ensureRole("platform_admin", "hospital", "doctor", "patient"),
  ensureActiveHospital,
  ensureRateLimiter(10, 10),
  CancelAppointmentsControllers.handle
);

export { router as appointmentsRoutes };
