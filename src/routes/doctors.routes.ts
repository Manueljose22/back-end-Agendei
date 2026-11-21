import { Router } from "express";
import AddDoctorsControllers from "../controllers/doctors/AddDoctorsControllers";
import ListDoctorController from "../controllers/doctors/ListDoctorController";
import GetDoctorsByIdControllers from "../controllers/doctors/GetDoctorsByIdControllers";
import UpdateDoctorsControllers from "../controllers/doctors/UpdateDoctorsControllers";
import DeleteDoctorsControllers from "../controllers/doctors/DeleteDoctorsControllers";
import GetDoctorServicesControllers from "../controllers/doctors/GetDoctorServicesControllers";
import ServiceToDoctorController from "../controllers/doctors/ServiceToDoctorController";
import GetDoctorsByHospitalsControllers from "../controllers/doctors/GetDoctorsByHospitalsControllers";
import SearchDoctorsControllers from "../controllers/doctors/SearchDoctorsControllers";
import { ensureActiveHospital } from "../middlewares/auth/ensureActiveHospital";
import { ensureRole } from "../middlewares/auth/ensureRole";
import { uploadSingleImage } from "../middlewares/upload/ImageUpload";
import { ensureRateLimiter } from "../middlewares/rateLimiter";

const router = Router();

const directoryRoles = ["platform_admin", "hospital", "doctor", "patient"] as const;

// Directório público autenticado: apenas médicos e hospitais activos.
// Hospitais e administrador global podem consultar os registos inactivos para gestão.
router.get("/doctors", ensureRole(...directoryRoles), ensureRateLimiter(1, 100), ListDoctorController.handle);
router.get("/doctors/search", ensureRole(...directoryRoles), ensureRateLimiter(1, 30), SearchDoctorsControllers.handle);

// Cadastro e associação de serviços são operações exclusivas do hospital proprietário.
router.post("/doctors", ensureRole("hospital"), ensureActiveHospital, uploadSingleImage, AddDoctorsControllers.handle);
router.post("/doctors/service", ensureRole("hospital", "platform_admin"), ensureActiveHospital, ServiceToDoctorController.handle);

// Consultas individuais respeitam o perfil e a propriedade do registo.
router.get("/doctors/:id", ensureRole(...directoryRoles), ensureRateLimiter(1, 100), GetDoctorsByIdControllers.handle);
router.get("/doctor/:id/service", ensureRole(...directoryRoles), ensureRateLimiter(1, 100), GetDoctorServicesControllers.handle);

// Apenas o hospital proprietário ou o administrador global podem alterar/remover médicos.
router.patch("/doctors/:id", ensureRole("hospital", "platform_admin"), ensureActiveHospital, UpdateDoctorsControllers.handle);
router.delete("/doctors/:id", ensureRole("hospital", "platform_admin"), ensureActiveHospital, DeleteDoctorsControllers.handle);

// Endpoint de gestão do hospital autenticado.
router.get("/hospital/doctors", ensureRole("hospital"), ensureActiveHospital, ensureRateLimiter(1, 100), GetDoctorsByHospitalsControllers.handle);

export { router as doctorsRoutes };
