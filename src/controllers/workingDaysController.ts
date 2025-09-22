import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../common/enums/httpStatus";
import { WorkingDaysService } from "../services/workingDaysService";
import { ZodValidator } from "../config/zodValidator.decorator";
import { QueryWorkingDaysSchema } from "../models/workingDaysDto";

export class WorkingDaysController {
  @ZodValidator({
    query: QueryWorkingDaysSchema,
  })
  static async calcWorkingDays(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const response = await WorkingDaysService.calcWorkingDays(req.query);
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
}
