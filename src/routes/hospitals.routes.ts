import { Router } from "express";
import AddHospitalControllers from "../controllers/hospitals/AddHospitalControllers";
import { uploadImage } from "../middlewares/upload/ImageUpload";
import ListHospitalsControllers from "../controllers/hospitals/ListHospitalsControllers";
import GetHospitalByIdControllers from "../controllers/hospitals/GetHospitalByIdControllers";
import DeleteHospitalByIdControllers from "../controllers/hospitals/DeleteHospitalByIdControllers";
import UpdateHospitalControllers from "../controllers/hospitals/UpdateHospitalControllers";
import SearchHospitalsControllers from "../controllers/hospitals/SearchHospitalsControllers";
import { ensureRateLimiter } from "../middlewares/rateLimiter";
import {
    ensureHospitalAccess,
    ensureHospitalManagementAccess
} from "../middlewares/auth/ensureHospitalAccess";

const router = Router();

// O registo de hospitais permanece público.
router.post('/hospitals/', uploadImage.array("images", 5), AddHospitalControllers.handle);

// Pacientes e médicos podem consultar o directório; hospitais vêem apenas o próprio registo.
router.get('/hospitals/', ensureHospitalAccess, ensureRateLimiter(1, 100), ListHospitalsControllers.handle);
router.get('/hospitals/search', ensureHospitalAccess, ensureRateLimiter(1, 30), SearchHospitalsControllers.handle);

// Acesso por ID: hospitais apenas ao próprio registo; pacientes, médicos e administrador podem consultar.
router.get('/hospitals/:id', ensureHospitalAccess, ensureRateLimiter(1, 100), GetHospitalByIdControllers.handle);

// Alterações e eliminação: administrador global ou o próprio hospital.
router.put('/hospitals/:id', ensureHospitalManagementAccess, uploadImage.array("images", 5), UpdateHospitalControllers.handle);
router.delete('/hospitals/:id', ensureHospitalManagementAccess, DeleteHospitalByIdControllers.handle);

export { router as HospitalsRoutes };
