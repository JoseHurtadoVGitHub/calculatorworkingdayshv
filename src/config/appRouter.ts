import { Router } from "express";
import { WorkingDaysController } from "../controllers/workingDaysController";
export const appRouter = Router();

appRouter.get("/working-days", WorkingDaysController.calcWorkingDays);
