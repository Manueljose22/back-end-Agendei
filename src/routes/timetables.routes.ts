
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


const timetablesRoutes = Router();



timetablesRoutes.post("/timetables", ensuredAuthenticated,  CreateAvailabilityController.handle);
timetablesRoutes.get("/:doctorId", ensuredAuthenticated,  GetAvailabilityByDoctorController.handle);
timetablesRoutes.put("/:id", ensuredAuthenticated,  UpdateAvailabilityController.handle);
timetablesRoutes.delete("/:id", ensuredAuthenticated,  DeleteAvailabilityController.handle);
timetablesRoutes.patch("/block/:id", ensuredAuthenticated,  BlockDayController.handle);
timetablesRoutes.patch("/unblock/:id", ensuredAuthenticated,  UnblockDayController.handle);
timetablesRoutes.patch("/book/:timetableId", ensuredAuthenticated,  BookHourController.handle);
timetablesRoutes.patch("/unbook/:timetableId", ensuredAuthenticated,  UnbookHourController.handle);

export { timetablesRoutes };
