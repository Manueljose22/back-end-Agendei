import { Router } from "express";
import { ensureRole } from "../middlewares/auth/ensureRole";
import { ensureActiveHospital } from "../middlewares/auth/ensureActiveHospital";
import ListAppointmentsControllers from "../controllers/appointments/ListAppointmentsControllers";
import AddAppointmentsControllers from "../controllers/appointments/AddAppointmentsControllers";
import UpdateAppointmentsControllers from "../controllers/appointments/UpdateAppointmentsControllers";
import ListAppointmentByPatientsControllers from "../controllers/appointments/ListAppointmentByPatientsControllers";
import CancelAppointmentsControllers from "../controllers/appointments/CancelAppointmentsControllers";
import ConfirmAppointmentController from "../controllers/appointments/ConfirmAppointmentController";
import RescheduleProposalsController from "../controllers/appointments/RescheduleProposalsController";
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

// O paciente pode actualizar a data/hora do próprio agendamento.
// Médico e hospital continuam a usar o fluxo de proposta de reagendamento.
router.patch(
  "/appointments/:id",
  ensureRole("platform_admin", "hospital", "doctor", "patient"),
  ensureActiveHospital,
  UpdateAppointmentsControllers.handle
);

router.post(
  "/appointments/:id/reschedule-proposals",
  ensureRole("hospital", "doctor"),
  ensureActiveHospital,
  ensureRateLimiter(5, 10),
  RescheduleProposalsController.create
);

router.patch(
  "/reschedule-proposals/:id/respond",
  ensureRole("patient"),
  ensureRateLimiter(5, 10),
  RescheduleProposalsController.respond
);

router.patch(
  "/appointments/:id/confirm",
  ensureRole("platform_admin", "hospital", "doctor"),
  ensureActiveHospital,
  ensureRateLimiter(10, 10),
  ConfirmAppointmentController.handle
);

router.patch(
  "/appointments/cancel/:id",
  ensureRole("platform_admin", "hospital", "doctor", "patient"),
  ensureActiveHospital,
  ensureRateLimiter(10, 10),
  CancelAppointmentsControllers.handle
);

export { router as appointmentsRoutes };
