import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/auth/ensuredAuthenticated";
import AddSpecialityControllers from "../controllers/specialities/AddSpecialityControllers";
import ListSpecialityControllers from "../controllers/specialities/ListSpecialityControllers";
import GetSpecialityByIdControllers from "../controllers/specialities/GetSpecialityByIdControllers";
import UpdateSpecialityControllers from "../controllers/specialities/UpdateSpecialityControllers";
import DeleteSpecialityByIdControllers from "../controllers/specialities/DeleteSpecialityByIdControllers";
import GetSpecialtyByHospitalControllers from "../controllers/specialities/GetSpecialtyByHospitalControllers";
import SearchSpecialitiesControllers from "../controllers/specialities/SearchSpecialitiesControllers";
import { ensureRateLimiter } from "../middlewares/rateLimiter";






const router = Router();


router.get('/specialty/:id', ensuredAuthenticated, ensureRateLimiter(1, 30), GetSpecialityByIdControllers.handle);
router.post('/specialty', ensuredAuthenticated, ensureRateLimiter(1, 100), AddSpecialityControllers.handle);
router.get('/specialty/', ensuredAuthenticated, ensureRateLimiter(1, 100), ListSpecialityControllers.handle);
router.get('/specialty/search', ensuredAuthenticated, ensureRateLimiter(1, 30), SearchSpecialitiesControllers.handle);
router.put('/specialty/:id', ensuredAuthenticated, ensureRateLimiter(1, 30), UpdateSpecialityControllers.handle);
router.delete('/specialty/:id', ensuredAuthenticated, ensureRateLimiter(1, 30), DeleteSpecialityByIdControllers.handle);
router.get('/hospital/specialty', ensuredAuthenticated, GetSpecialtyByHospitalControllers.handle);





export { router as SpecialitiesRoutes }