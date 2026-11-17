
import { Router } from "express";
import CreateAvailabilityController from "../controllers/timetables/CreateAvailabilityController";
import GetAvailabilityByDoctorController from "../controllers/timetables/GetAvailabilityByDoctorController";
import UpdateAvailabilityController from "../controllers/timetables/UpdateAvailabilityController";
import DeleteAvailabilityController from "../controllers/timetables/DeleteAvailabilityController";
import BlockDayController from "../controllers/timetables/BlockDayController";
import UnblockDayController from "../controllers/timetables/UnblockDayController";
import BookHourController from "../controllers/timetables/BookHourController";
import UnbookHourController from "../controllers/timetables/UnbookHourController";
import { ensureRole } from "../middlewares/auth/ensureRole";
import { ensureActiveHospital } from "../middlewares/auth/ensureActiveHospital";


const timetablesRoutes = Router();



timetablesRoutes.post("/timetables", ensureRole("platform_admin"), CreateAvailabilityController.handle);
timetablesRoutes.get("/:doctorId", ensureRole("platform_admin", "hospital", "doctor", "patient"), GetAvailabilityByDoctorController.handle);
timetablesRoutes.patch("/:id", ensureRole("platform_admin"), UpdateAvailabilityController.handle);
timetablesRoutes.delete("/:id", ensuredAuthenticated, ensureActiveHospital, DeleteAvailabilityController.handle);
timetablesRoutes.patch("/block/:id", ensuredAuthenticated, ensureActiveHospital, BlockDayController.handle);
timetablesRoutes.patch("/unblock/:id", ensuredAuthenticated, ensureActiveHospital, UnblockDayController.handle);
timetablesRoutes.patch("/book/:timetableId", ensuredAuthenticated, ensureActiveHospital, BookHourController.handle);
timetablesRoutes.patch("/unbook/:timetableId", ensuredAuthenticated, ensureActiveHospital, UnbookHourController.handle);

export { timetablesRoutes };
