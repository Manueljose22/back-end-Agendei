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

// Consultas institucionais: administrador, hospital e médico.
router.get(
  "/appointments",
  ensureRole("platform_admin", "hospital", "doctor"),
  ensureRateLimiter(1, 100),
  ListAppointmentsControllers.handle
);

// O paciente consulta exclusivamente as próprias marcações.
router.get(
  "/appointments/all",
  ensureRole("patient"),
  ensureRateLimiter(1, 100),
  ListAppointmentByPatientsControllers.handle
);

// Apenas pacientes podem criar marcações em seu próprio nome.
router.post(
  "/appointments/",
  ensureRole("patient"),
  AddAppointmentsControllers.handle
);

// A autorização sobre a consulta concreta é validada no serviço.
router.patch(
  "/appointments/:id",
  ensureRole("platform_admin", "hospital", "doctor", "patient"),
  UpdateAppointmentsControllers.handle
);

router.patch(
  "/appointments/cancel/:id",
  ensureRole("platform_admin", "hospital", "doctor", "patient"),
  ensureRateLimiter(10, 10),
  CancelAppointmentsControllers.handle
);

export { router as appointmentsRoutes };
