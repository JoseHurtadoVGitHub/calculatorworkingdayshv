import { ZodObject, ZodError } from "zod";
import "reflect-metadata";
import { Request, Response, NextFunction } from "express";

type RequestSchema = {
  body?: ZodObject<any>;
  query?: ZodObject<any>;
  params?: ZodObject<any>;
};

function validateZodSchema() {
  return (schema: RequestSchema): MethodDecorator =>
    (target, propertyKey, descriptor: PropertyDescriptor) => {
      const originalMethod = descriptor.value;

      descriptor.value = async function (
        req: Request,
        res: Response,
        next: NextFunction
      ) {
        try {
          const { body, query, params } = schema;
          const reqParams: Record<string, unknown> = {};

          if (body && req.body) {
            reqParams.body = body.parse(req.body);
          }

          if (query && req.query) {
            reqParams.query = query.parse(req.query);
          }

          if (params && req.params) {
            reqParams.params = params.parse(req.params);
          }

          return await originalMethod.call(
            this,
            {
              ...req,
              ...reqParams,
            },
            res,
            next
          );
        } catch (error) {
          return next(error);
        }
      };

      return descriptor;
    };
}

export const ZodValidator = validateZodSchema();
