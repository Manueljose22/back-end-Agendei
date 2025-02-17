import { Router } from "express";
import ListClientsController from "../controllers/clients/ListClientsController";
import AddClientsControllers from "../controllers/clients/AddClientsControllers";
import GetClientsByIdControllers from "../controllers/clients/GetClientsByIdControllers";
import UpdateClientsControllers from "../controllers/clients/UpdateClientsControllers";
import DeleteClientsControllers from "../controllers/clients/DeleteClientsControllers";
import { ensuredAuthenticated } from "../middlewares/auth/ensuredAuthenticated";
import ProfileClientsControllers from "../controllers/clients/ProfileClientsControllers";



const router = Router();



router.get('/clients/profile', ensuredAuthenticated, ProfileClientsControllers.handle);
router.get('/clients/', ensuredAuthenticated, ListClientsController.handle);
router.post('/clients/register', AddClientsControllers.handle);
router.get('/clients/:id', ensuredAuthenticated, GetClientsByIdControllers.handle);
router.put('/clients/:id', ensuredAuthenticated, UpdateClientsControllers.handle);
router.delete('/clients/:id', ensuredAuthenticated, DeleteClientsControllers.handle);




export { router as clientsRoutes }