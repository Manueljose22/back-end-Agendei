import { Router } from "express";
import { doctorsRoutes } from "./doctors.routes";
import { ServicesRoutes } from "./services.routes";
import { clientsRoutes } from "./clients.routes";
import { sessionsRoutes } from "./sessions.routes";
import { appointmentsRoutes } from "./appointments.routes";
import { adminsRoutes } from "./admins.routes";
import { HoursRoutes } from "./hours.routes";



const routes = Router();

routes.use(doctorsRoutes);
routes.use(ServicesRoutes);
routes.use(clientsRoutes);
routes.use(sessionsRoutes);
routes.use(appointmentsRoutes);
routes.use(adminsRoutes);
routes.use(HoursRoutes);



export { routes }