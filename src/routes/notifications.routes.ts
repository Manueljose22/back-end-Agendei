import { Router } from "express";
import ListNotificationsController from "../controllers/notifications/ListNotificationsController";
import MarkNotificationAsReadController from "../controllers/notifications/MarkNotificationAsReadController";
import ExpoPushTokenController from "../controllers/notifications/ExpoPushTokenController";
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

router.put(
    "/notifications/push-token",
    ensureRole(...notificationRoles),
    ensureRateLimiter(10, 60),
    ExpoPushTokenController.register
);

router.delete(
    "/notifications/push-token",
    ensureRole(...notificationRoles),
    ensureRateLimiter(10, 60),
    ExpoPushTokenController.remove
);

export { router as notificationsRoutes };
