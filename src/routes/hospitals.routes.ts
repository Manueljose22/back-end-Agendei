import { Router } from "express";
import AddHospitalControllers from "../controllers/hospitals/AddHospitalControllers";
import { uploadImage } from "../middlewares/upload/ImageUpload";
import ListHospitalsControllers from "../controllers/hospitals/ListHospitalsControllers";
import GetHospitalByIdControllers from "../controllers/hospitals/GetHospitalByIdControllers";
import DeleteHospitalByIdControllers from "../controllers/hospitals/DeleteHospitalByIdControllers";
import UpdateHospitalControllers from "../controllers/hospitals/UpdateHospitalControllers";
import SearchHospitalsControllers from "../controllers/hospitals/SearchHospitalsControllers";
import { ensureRateLimiter } from "../middlewares/rateLimiter";
import { ensureAdminAuthenticated } from "../middlewares/auth/ensureAdminAuthenticated";
import { ensureHospitalAccess } from "../middlewares/auth/ensureHospitalAccess";

const router = Router();

// O registo de hospitais permanece público.
router.post('/hospitals/', uploadImage.array("images", 5), AddHospitalControllers.handle);

// Um hospital autenticado recebe apenas o seu próprio registo.
// O administrador global pode consultar a lista completa.
router.get('/hospitals/', ensureHospitalAccess, ensureRateLimiter(1, 100), ListHospitalsControllers.handle);

// A pesquisa global de hospitais fica reservada ao administrador da plataforma.
router.get('/hospitals/search', ensureAdminAuthenticated, ensureRateLimiter(1, 30), SearchHospitalsControllers.handle);

// Acesso por ID, actualização e eliminação: administrador global ou proprietário do registo.
router.get('/hospitals/:id', ensureHospitalAccess, ensureRateLimiter(1, 100), GetHospitalByIdControllers.handle);
router.put('/hospitals/:id', ensureHospitalAccess, uploadImage.array("images", 5), UpdateHospitalControllers.handle);
router.delete('/hospitals/:id', ensureHospitalAccess, DeleteHospitalByIdControllers.handle);

export { router as HospitalsRoutes };
