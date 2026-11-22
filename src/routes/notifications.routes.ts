import { Router } from "express";
import ListNotificationsController from "../controllers/notifications/ListNotificationsController";
import MarkNotificationAsReadController from "../controllers/notifications/MarkNotificationAsReadController";
import { ensureRole } from "../middlewares/auth/ensureRole";
import { ensureRateLimiter } from "../middlewares/rateLimiter";

const router = Router();
const notificationRoles = ["patient", "doctor", "hospital"] as const;

router.get(
    "/notifications",
    ensureRole(...notificationRoles),
    ensureRateLimiter(1, 60),
    ListNotificationsController.handle
);

router.patch(
    "/notifications/:id/read",
    ensureRole(...notificationRoles),
    ensureRateLimiter(10, 30),
    MarkNotificationAsReadController.handle
);

export { router as notificationsRoutes };
