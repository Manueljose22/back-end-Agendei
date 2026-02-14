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
import SearchDoctorsControllers from "../controllers/doctors/SearchDoctorsControllers";
import { ensureRateLimiter } from "../middlewares/rateLimiter";

const router = Router();



router.get('/doctors', ensuredAuthenticated , ensureRateLimiter(1, 100), ListDoctorController.handle);
router.get('/doctors/search', ensuredAuthenticated, ensureRateLimiter(1, 30), SearchDoctorsControllers.handle);
router.post('/doctors', ensuredAuthenticated, AddDoctorsControllers.handle, uploadImage.single('photo'));
router.post('/doctors/service', ensuredAuthenticated, ServiceToDoctorController.handle);
router.get('/doctors/:id', ensuredAuthenticated , ensureRateLimiter(1, 100), GetDoctorsByIdControllers.handle);
router.get('/doctor/:id/service', ensuredAuthenticated , ensureRateLimiter(1, 100), GetDoctorServicesControllers.handle);
router.put('/doctors/:id', ensuredAuthenticated, UpdateDoctorsControllers.handle);
router.delete('/doctors/:id', ensuredAuthenticated, DeleteDoctorsControllers.handle);

// Hospitals Doctors Routes
router.get('/hospital/doctors', ensuredAuthenticated , ensureRateLimiter(1, 100), GetDoctorsByHospitalsControllers.handle);




export { router as doctorsRoutes }

