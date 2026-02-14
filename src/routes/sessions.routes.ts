import { Router } from "express";
import SessionsControllers from "../controllers/sessions/SessionsControllers";
import { ensureRateLimiter } from "../middlewares/rateLimiter";


const router = Router();


router.post("/session/login", ensureRateLimiter(15), SessionsControllers.handle);






export { router as sessionsRoutes }

