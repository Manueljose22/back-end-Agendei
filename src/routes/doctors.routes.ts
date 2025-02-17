import { Router } from "express";
import { filesUpload } from "../middlewares/upload/filesUpload";
import AddDoctorsControllers from "../controllers/doctors/AddDoctorsControllers";
import ListDoctorController from "../controllers/doctors/ListDoctorController";
import GetDoctorsByIdControllers from "../controllers/doctors/GetDoctorsByIdControllers";
import UpdateDoctorsControllers from "../controllers/doctors/UpdateDoctorsControllers";
import DeleteDoctorsControllers from "../controllers/doctors/DeleteDoctorsControllers";
import { ensuredAuthenticated } from "../middlewares/auth/ensuredAuthenticated";
import GetDoctorServicesControllers from "../controllers/doctors/GetDoctorServicesControllers";

const router = Router();





router.get('/doctors', ensuredAuthenticated , ListDoctorController.handle);
router.post('/doctors/register', ensuredAuthenticated, AddDoctorsControllers.handle, filesUpload.single('img'));
router.get('/doctors/:id', ensuredAuthenticated , GetDoctorsByIdControllers.handle);
router.get('/doctors/:id/services', ensuredAuthenticated , GetDoctorServicesControllers.handle);
router.put('/doctors/:id', ensuredAuthenticated, UpdateDoctorsControllers.handle);
router.delete('/doctors/:id', ensuredAuthenticated, DeleteDoctorsControllers.handle);




export { router as doctorsRoutes }

