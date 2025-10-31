import { Router } from "express";
import { doctorsRoutes } from "./doctors.routes";
import { ServicesRoutes } from "./services.routes";
import { clientsRoutes } from "./patients.routes";
import { sessionsRoutes } from "./sessions.routes";
import { appointmentsRoutes } from "./appointments.routes";
import { adminsRoutes } from "./admins.routes";
import { HoursRoutes } from "./hours.routes";
import { HospitalsRoutes } from "./hospitals.routes";
import { SpecialitiesRoutes } from "./specialities.routes";



const routes = Router();

routes.use(doctorsRoutes);
routes.use(ServicesRoutes);
routes.use(clientsRoutes);
routes.use(sessionsRoutes);
routes.use(appointmentsRoutes);
routes.use(adminsRoutes);
routes.use(HoursRoutes);
routes.use(HospitalsRoutes);
routes.use(SpecialitiesRoutes);



export { routes }