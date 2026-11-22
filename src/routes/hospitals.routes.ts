import { Router } from "express";
import AddHospitalControllers from "../controllers/hospitals/AddHospitalControllers";
import { uploadMultipleImages } from "../middlewares/upload/ImageUpload";
import ListHospitalsControllers from "../controllers/hospitals/ListHospitalsControllers";
import GetHospitalByIdControllers from "../controllers/hospitals/GetHospitalByIdControllers";
import DeleteHospitalByIdControllers from "../controllers/hospitals/DeleteHospitalByIdControllers";
import UpdateHospitalControllers from "../controllers/hospitals/UpdateHospitalControllers";
import UpdateHospitalStatusController from "../controllers/hospitals/UpdateHospitalStatusController";
import SearchHospitalsControllers from "../controllers/hospitals/SearchHospitalsControllers";
import ListHospitalPatientsController from "../controllers/hospitals/ListHospitalPatientsController";
import { ensureRateLimiter } from "../middlewares/rateLimiter";
import {
    ensureHospitalAccess,
    ensureHospitalManagementAccess
} from "../middlewares/auth/ensureHospitalAccess";
import { ensureRole } from "../middlewares/auth/ensureRole";
import { ensureActiveHospital } from "../middlewares/auth/ensureActiveHospital";

const router = Router();

// O registo permanece público, com limite de pedidos e validação uniforme dos ficheiros.
router.post('/hospitals/', ensureRateLimiter(15, 10), uploadMultipleImages, AddHospitalControllers.handle);

router.get('/hospitals/', ensureHospitalAccess, ensureRateLimiter(1, 100), ListHospitalsControllers.handle);
router.get('/hospitals/search', ensureHospitalAccess, ensureRateLimiter(1, 30), SearchHospitalsControllers.handle);

// A listagem usa exclusivamente o hospital identificado pelo token JWT.
router.get(
    '/hospitals/me/patients',
    ensureRole("hospital"),
    ensureActiveHospital,
    ensureRateLimiter(1, 60),
    ListHospitalPatientsController.handle
);

router.patch('/hospitals/:id/status', ensureRole("platform_admin"), UpdateHospitalStatusController.handle);

router.get('/hospitals/:id', ensureHospitalAccess, ensureRateLimiter(1, 100), GetHospitalByIdControllers.handle);

router.patch('/hospitals/:id', ensureHospitalManagementAccess, ensureActiveHospital, uploadMultipleImages, UpdateHospitalControllers.handle);
router.delete('/hospitals/:id', ensureHospitalManagementAccess, ensureActiveHospital, DeleteHospitalByIdControllers.handle);

export { router as HospitalsRoutes };
