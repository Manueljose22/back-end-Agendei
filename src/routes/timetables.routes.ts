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

const timetablesRoutes = Router();

// Rotas legadas: manter escrita restrita ao administrador da plataforma.
// A gestão normal da agenda passa pelos endpoints /doctors/:doctorId/schedule.
timetablesRoutes.post("/timetables", ensureRole("platform_admin"), CreateAvailabilityController.handle);
timetablesRoutes.get("/timetables/:doctorId", ensureRole("platform_admin", "hospital", "doctor", "patient"), GetAvailabilityByDoctorController.handle);
timetablesRoutes.patch("/timetables/:id", ensureRole("platform_admin"), UpdateAvailabilityController.handle);
timetablesRoutes.delete("/timetables/:id", ensureRole("platform_admin"), DeleteAvailabilityController.handle);
timetablesRoutes.patch("/timetables/block/:id", ensureRole("platform_admin"), BlockDayController.handle);
timetablesRoutes.patch("/timetables/unblock/:id", ensureRole("platform_admin"), UnblockDayController.handle);
timetablesRoutes.patch("/timetables/book/:timetableId", ensureRole("platform_admin"), BookHourController.handle);
timetablesRoutes.patch("/timetables/unbook/:timetableId", ensureRole("platform_admin"), UnbookHourController.handle);

export { timetablesRoutes };
