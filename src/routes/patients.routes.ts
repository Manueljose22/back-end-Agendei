import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/auth/ensuredAuthenticated";
import AddPatientsControllers from "../controllers/patients/AddPatientsControllers";
import { uploadImage } from "../middlewares/upload/ImageUpload";
import GetPatientsByIdControllers from "../controllers/patients/GetPatientsByIdControllers";
import UpdatePatientsControllers from "../controllers/patients/UpdatePatientsControllers";
import DeletePatientsControllers from "../controllers/patients/DeletePatientsControllers";
import ListPatientsController from "../controllers/patients/ListPatientsController";
import UpdatePasswordPatientControllers from "../controllers/patients/UpdatePasswordPatientControllers";
import ProfilePatientsControllers from "../controllers/patients/ProfilePatientsControllers";
import SearchPatientsControllers from "../controllers/patients/SearchPatientsControllers";
import { ensureRateLimiter } from "../middlewares/rateLimiter";




const router = Router();





router.get('/patients/profile', ensuredAuthenticated, ProfilePatientsControllers.handle);
router.get('/patients', ensuredAuthenticated, ensureRateLimiter(1, 100), ListPatientsController.handle);
router.get('/patients/search', ensuredAuthenticated, ensureRateLimiter(1, 30), SearchPatientsControllers.handle);
router.post('/patients/', uploadImage.single("photo"), AddPatientsControllers.handle);
router.get('/patients/:id', ensuredAuthenticated, ensureRateLimiter(1, 100), GetPatientsByIdControllers.handle);
router.put('/patients/:id', ensuredAuthenticated, uploadImage.single("photo"), UpdatePatientsControllers.handle);
router.put('/patients/changePassword/:id', ensuredAuthenticated, ensureRateLimiter(15, 5), UpdatePasswordPatientControllers.handle);
router.delete('/patients/:id', ensuredAuthenticated, DeletePatientsControllers.handle);





export { router as clientsRoutes }