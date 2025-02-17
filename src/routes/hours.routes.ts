import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/auth/ensuredAuthenticated";





const router = Router();


// router.get('/hours/', ensuredAuthenticated, );
// router.post('/hours/register', ensuredAuthenticated, );
// router.get('/hours/:id', ensuredAuthenticated, );
// router.put('/hours/:id', ensuredAuthenticated, );
// router.delete('/hours/:id', ensuredAuthenticated, );






export { router as HoursRoutes }