
import { Router } from "express";
import { CreateAvailabilityController } from "../controllers/timetables/CreateAvailabilityController";
import { GetAvailabilityByDoctorController } from "../controllers/timetables/GetAvailabilityByDoctorController";
import { UpdateAvailabilityController } from "../controllers/timetables/UpdateAvailabilityController";
import { DeleteAvailabilityController } from "../controllers/timetables/DeleteAvailabilityController";
import { BlockDayController } from "../controllers/timetables/BlockDayController";
import { UnblockDayController } from "../controllers/timetables/UnblockDayController";
import { BookHourController } from "../controllers/timetables/BookHourController";
import { UnbookHourController } from "../controllers/timetables/UnbookHourController";

const timetablesRoutes = Router();

const createAvailabilityController = new CreateAvailabilityController();
const getAvailabilityByDoctorController = new GetAvailabilityByDoctorController();
const updateAvailabilityController = new UpdateAvailabilityController();
const deleteAvailabilityController = new DeleteAvailabilityController();
const blockDayController = new BlockDayController();
const unblockDayController = new UnblockDayController();
const bookHourController = new BookHourController();
const unbookHourController = new UnbookHourController();

timetablesRoutes.post("/", createAvailabilityController.handle);
timetablesRoutes.get("/:doctorId", getAvailabilityByDoctorController.handle);
timetablesRoutes.put("/:id", updateAvailabilityController.handle);
timetablesRoutes.delete("/:id", deleteAvailabilityController.handle);
timetablesRoutes.patch("/block/:id", blockDayController.handle);
timetablesRoutes.patch("/unblock/:id", unblockDayController.handle);
timetablesRoutes.patch("/book/:timetableId", bookHourController.handle);
timetablesRoutes.patch("/unbook/:timetableId", unbookHourController.handle);

export { timetablesRoutes };
