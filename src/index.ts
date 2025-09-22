// src/index.ts
import express, { Request, Response } from "express";
import morgan from "morgan";
import { appRouter } from "./config/appRouter";
import { ZodErrorHandlerMiddleware } from "./middleWares/zodErrorHandlerMiddleware";
import { ErrorHandlerMiddleware } from "./middleWares/errorHandlerMiddleware";
import "reflect-metadata";
const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", appRouter);
app.use(ZodErrorHandlerMiddleware);
app.use(ErrorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
