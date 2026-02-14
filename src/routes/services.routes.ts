import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/auth/ensuredAuthenticated";
import GetAllServicesController from "../controllers/service/GetAllServicesController";
import CreateServicesController from "../controllers/service/CreateServicesController";
import GetByIdServicesController from "../controllers/service/GetByIdServicesController";
import UpdateServicesController from "../controllers/service/UpdateServicesController";
import DeleteServicesController from "../controllers/service/DeleteServicesController";
import GetAllServicesHospitalController from "../controllers/service/GetAllServicesHospitalController";
import { ensureRateLimiter } from "../middlewares/rateLimiter";





const router = Router();


router.get('/services/', ensuredAuthenticated, ensureRateLimiter(1, 100), GetAllServicesController.handle);
router.post('/services', ensuredAuthenticated, ensureRateLimiter(1, 100), CreateServicesController.handle);
router.get('/services/:id', ensuredAuthenticated, ensureRateLimiter(1, 30), GetByIdServicesController.handle);
router.put('/services/:id', ensuredAuthenticated, ensureRateLimiter(1, 30), UpdateServicesController.handle);
router.delete('/services/:id', ensuredAuthenticated, ensureRateLimiter(1, 30), DeleteServicesController.handle);

// web
router.get("/hospital/services", ensuredAuthenticated, GetAllServicesHospitalController.handle)






export { router as ServicesRoutes }

