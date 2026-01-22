import { Router } from "express";
import AddDoctorsControllers from "../controllers/doctors/AddDoctorsControllers";
import ListDoctorController from "../controllers/doctors/ListDoctorController";
import GetDoctorsByIdControllers from "../controllers/doctors/GetDoctorsByIdControllers";
import UpdateDoctorsControllers from "../controllers/doctors/UpdateDoctorsControllers";
import DeleteDoctorsControllers from "../controllers/doctors/DeleteDoctorsControllers";
import { ensuredAuthenticated } from "../middlewares/auth/ensuredAuthenticated";
import GetDoctorServicesControllers from "../controllers/doctors/GetDoctorServicesControllers";
import { uploadImage } from "../middlewares/upload/ImageUpload";
import ServiceToDoctorController from "../controllers/doctors/ServiceToDoctorController";
import GetDoctorsByHospitalsControllers from "../controllers/doctors/GetDoctorsByHospitalsControllers";

const router = Router();



router.get('/doctors', ensuredAuthenticated , ListDoctorController.handle);
router.post('/doctors', ensuredAuthenticated, AddDoctorsControllers.handle, uploadImage.single('photo'));
router.post('/doctors/service', ensuredAuthenticated, ServiceToDoctorController.handle);
router.get('/doctors/:id', ensuredAuthenticated , GetDoctorsByIdControllers.handle);
router.get('/doctors/:id/services', ensuredAuthenticated , GetDoctorServicesControllers.handle);
router.put('/doctors/:id', ensuredAuthenticated, UpdateDoctorsControllers.handle);
router.delete('/doctors/:id', ensuredAuthenticated, DeleteDoctorsControllers.handle);

// Hospitals Doctors Routes
router.get('/hospital/doctors', ensuredAuthenticated , GetDoctorsByHospitalsControllers.handle);




export { router as doctorsRoutes }

