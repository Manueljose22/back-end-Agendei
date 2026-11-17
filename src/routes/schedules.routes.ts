import { Router } from "express";
import DoctorScheduleController from "../controllers/schedules/DoctorScheduleController";
import { ensureRole } from "../middlewares/auth/ensureRole";
import { ensureActiveHospital } from "../middlewares/auth/ensureActiveHospital";

const schedulesRoutes = Router();

const scheduleReaders = ["platform_admin", "hospital", "doctor", "patient"] as const;
const scheduleManagers = ["platform_admin", "hospital", "doctor"] as const;

schedulesRoutes.get(
    "/doctors/:doctorId/schedule",
    ensureRole(...scheduleReaders),
    DoctorScheduleController.get
);

schedulesRoutes.put(
    "/doctors/:doctorId/schedule",
    ensureRole(...scheduleManagers),
    ensureActiveHospital,
    DoctorScheduleController.replaceRules
);

export { schedulesRoutes };
