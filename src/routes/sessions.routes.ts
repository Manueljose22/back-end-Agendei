import { Router } from "express";
import SessionsControllers from "../controllers/sessions/SessionsControllers";


const router = Router();


router.post('/session/login', SessionsControllers.handle);






export { router as sessionsRoutes }

