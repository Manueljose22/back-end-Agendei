
import { Router } from "express";
import CreateAvailabilityController from "../controllers/timetables/CreateAvailabilityController";
import GetAvailabilityByDoctorController from "../controllers/timetables/GetAvailabilityByDoctorController";
import UpdateAvailabilityController from "../controllers/timetables/UpdateAvailabilityController";
import DeleteAvailabilityController from "../controllers/timetables/DeleteAvailabilityController";
import BlockDayController from "../controllers/timetables/BlockDayController";
import UnblockDayController from "../controllers/timetables/UnblockDayController";
import BookHourController from "../controllers/timetables/BookHourController";
import UnbookHourController from "../controllers/timetables/UnbookHourController";
import { ensuredAuthenticated } from "../middlewares/auth/ensuredAuthenticated";
import { ensureActiveHospital } from "../middlewares/auth/ensureActiveHospital";


const timetablesRoutes = Router();



timetablesRoutes.post("/timetables", ensuredAuthenticated, ensureActiveHospital, CreateAvailabilityController.handle);
timetablesRoutes.get("/:doctorId", ensuredAuthenticated,  GetAvailabilityByDoctorController.handle);
timetablesRoutes.put("/:id", ensuredAuthenticated, ensureActiveHospital, UpdateAvailabilityController.handle);
timetablesRoutes.delete("/:id", ensuredAuthenticated, ensureActiveHospital, DeleteAvailabilityController.handle);
timetablesRoutes.patch("/block/:id", ensuredAuthenticated, ensureActiveHospital, BlockDayController.handle);
timetablesRoutes.patch("/unblock/:id", ensuredAuthenticated, ensureActiveHospital, UnblockDayController.handle);
timetablesRoutes.patch("/book/:timetableId", ensuredAuthenticated, ensureActiveHospital, BookHourController.handle);
timetablesRoutes.patch("/unbook/:timetableId", ensuredAuthenticated, ensureActiveHospital, UnbookHourController.handle);

export { timetablesRoutes };
