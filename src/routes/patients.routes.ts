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




const router = Router();





router.get('/patients/profile', ensuredAuthenticated, ProfilePatientsControllers.handle);
router.get('/patients', ensuredAuthenticated, ListPatientsController.handle);
router.post('/patients/', uploadImage.single("photo"), AddPatientsControllers.handle);
router.get('/patients/:id', ensuredAuthenticated, GetPatientsByIdControllers.handle);
router.put('/patients/:id', ensuredAuthenticated, uploadImage.single("photo"), UpdatePatientsControllers.handle);
router.put('/patients/changePassword/:id', ensuredAuthenticated, UpdatePasswordPatientControllers.handle);
router.delete('/patients/:id', ensuredAuthenticated, DeletePatientsControllers.handle);





export { router as clientsRoutes }