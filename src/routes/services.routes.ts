import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/auth/ensuredAuthenticated";
import GetAllServicesController from "../controllers/service/GetAllServicesController";
import CreateServicesController from "../controllers/service/CreateServicesController";
import GetByIdServicesController from "../controllers/service/GetByIdServicesController";
import UpdateServicesController from "../controllers/service/UpdateServicesController";
import DeleteServicesController from "../controllers/service/DeleteServicesController";





const router = Router();


router.get('/services/', ensuredAuthenticated, GetAllServicesController.handle);
router.post('/services', ensuredAuthenticated, CreateServicesController.handle);
router.get('/services/:id', ensuredAuthenticated, GetByIdServicesController.handle);
router.put('/services/:id', ensuredAuthenticated, UpdateServicesController.handle);
router.delete('/services/:id', ensuredAuthenticated, DeleteServicesController.handle);






export { router as ServicesRoutes }

