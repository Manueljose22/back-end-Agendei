import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/auth/ensuredAuthenticated";
import AddSpecialityControllers from "../controllers/specialities/AddSpecialityControllers";
import ListSpecialityControllers from "../controllers/specialities/ListSpecialityControllers";
import GetSpecialityByIdControllers from "../controllers/specialities/GetSpecialityByIdControllers";
import UpdateSpecialityControllers from "../controllers/specialities/UpdateSpecialityControllers";
import DeleteSpecialityByIdControllers from "../controllers/specialities/DeleteSpecialityByIdControllers";
import GetSpecialtyByHospitalControllers from "../controllers/specialities/GetSpecialtyByHospitalControllers";






const router = Router();


router.get('/specialty/:id', ensuredAuthenticated, GetSpecialityByIdControllers.handle);
router.post('/specialty', ensuredAuthenticated, AddSpecialityControllers.handle);
router.get('/specialty/', ensuredAuthenticated, ListSpecialityControllers.handle);
router.put('/specialty/:id', ensuredAuthenticated, UpdateSpecialityControllers.handle);
router.delete('/specialty/:id', ensuredAuthenticated, DeleteSpecialityByIdControllers.handle);
router.get('/hospital/specialty', ensuredAuthenticated, GetSpecialtyByHospitalControllers.handle);





export { router as SpecialitiesRoutes }