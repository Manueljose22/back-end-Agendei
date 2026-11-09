import { Router } from "express";
import AuthControllers from "../controllers/auth/AuthControllers";
import { ensureRateLimiter } from "../middlewares/rateLimiter";
import { ensureSupabaseAuthenticated } from "../middlewares/auth/ensureSupabaseAuthenticated";

const router = Router();

router.post("/auth/patients/register", ensureRateLimiter(15, 5), AuthControllers.registerPatient);
router.post("/auth/login", ensureRateLimiter(15, 10), AuthControllers.login);
router.post("/auth/password/reset", ensureRateLimiter(60, 3), AuthControllers.requestPasswordReset);
router.get("/auth/me", ensureSupabaseAuthenticated, AuthControllers.me);

export { router as authRoutes };
