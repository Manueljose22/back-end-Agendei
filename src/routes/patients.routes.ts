import { Router } from "express";
import AddPatientsControllers from "../controllers/patients/AddPatientsControllers";
import GetPatientsByIdControllers from "../controllers/patients/GetPatientsByIdControllers";
import UpdatePatientsControllers from "../controllers/patients/UpdatePatientsControllers";
import DeletePatientsControllers from "../controllers/patients/DeletePatientsControllers";
import ListPatientsController from "../controllers/patients/ListPatientsController";
import UpdatePasswordPatientControllers from "../controllers/patients/UpdatePasswordPatientControllers";
import ProfilePatientsControllers from "../controllers/patients/ProfilePatientsControllers";
import SearchPatientsControllers from "../controllers/patients/SearchPatientsControllers";
import { ensureRole } from "../middlewares/auth/ensureRole";
import { uploadSingleImage } from "../middlewares/upload/ImageUpload";
import { ensureRateLimiter } from "../middlewares/rateLimiter";

const router = Router();

// O registo é público, mas limitado para reduzir abuso automatizado.
router.post(
    "/patients/",
    ensureRateLimiter(15, 10),
    uploadSingleImage,
    AddPatientsControllers.handle
);

router.get("/patients/profile", ensureRole("patient"), ProfilePatientsControllers.handle);
router.get("/patients", ensureRole("platform_admin"), ensureRateLimiter(1, 100), ListPatientsController.handle);
router.get("/patients/search", ensureRole("platform_admin"), ensureRateLimiter(1, 30), SearchPatientsControllers.handle);

router.get("/patients/:id", ensureRole("patient", "platform_admin"), ensureRateLimiter(1, 100), GetPatientsByIdControllers.handle);
router.patch("/patients/:id", ensureRole("patient", "platform_admin"), uploadSingleImage, UpdatePatientsControllers.handle);
router.patch("/patients/changePassword/:id", ensureRole("patient"), ensureRateLimiter(15, 5), UpdatePasswordPatientControllers.handle);
router.delete("/patients/:id", ensureRole("patient", "platform_admin"), DeletePatientsControllers.handle);

export { router as clientsRoutes };
