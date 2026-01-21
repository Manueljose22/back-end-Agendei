import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/auth/ensuredAuthenticated";
import AddHospitalControllers from "../controllers/hospitals/AddHospitalControllers";
import { uploadImage } from "../middlewares/upload/ImageUpload";
import ListHospitalsControllers from "../controllers/hospitals/ListHospitalsControllers";
import GetHospitalByIdControllers from "../controllers/hospitals/GetHospitalByIdControllers";
import DeleteHospitalByIdControllers from "../controllers/hospitals/DeleteHospitalByIdControllers";
import UpdateHospitalControllers from "../controllers/hospitals/UpdateHospitalControllers";





const router = Router();


router.post('/hospitals/', AddHospitalControllers.handle);
router.get('/hospitals/', ensuredAuthenticated, ListHospitalsControllers.handle);
router.get('/hospitals/:id', ensuredAuthenticated, GetHospitalByIdControllers.handle);
router.put('/hospitals/:id', ensuredAuthenticated, uploadImage.array("images", 5), UpdateHospitalControllers.handle);
router.delete('/hospitals/:id', ensuredAuthenticated, DeleteHospitalByIdControllers.handle);






export { router as HospitalsRoutes }