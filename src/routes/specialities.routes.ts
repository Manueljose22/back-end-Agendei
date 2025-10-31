import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/auth/ensuredAuthenticated";
import AddSpecialityControllers from "../controllers/specialities/AddSpecialityControllers";
import ListSpecialityControllers from "../controllers/specialities/ListSpecialityControllers";
import GetSpecialityByIdControllers from "../controllers/specialities/GetSpecialityByIdControllers";
import UpdateSpecialityControllers from "../controllers/specialities/UpdateSpecialityControllers";
import DeleteSpecialityByIdControllers from "../controllers/specialities/DeleteSpecialityByIdControllers";






const router = Router();


router.post('/speciality', ensuredAuthenticated, AddSpecialityControllers.handle);
router.get('/speciality/', ensuredAuthenticated, ListSpecialityControllers.handle);
router.get('/speciality/:id', ensuredAuthenticated, GetSpecialityByIdControllers.handle);
router.put('/speciality/:id', ensuredAuthenticated, UpdateSpecialityControllers.handle);
router.delete('/speciality/:id', ensuredAuthenticated, DeleteSpecialityByIdControllers.handle);






export { router as SpecialitiesRoutes }