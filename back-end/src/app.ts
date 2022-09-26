import cors from "cors";
import express from "express";
import "express-async-errors";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";
import recommendationRouter from "./routers/recommendationRouter";
import dotenv from "dotenv";
import testEnvironmentRouter from "./routers/testEnvironmentRouter";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if(process.env.NODE_ENV === "TEST") app.use(testEnvironmentRouter);

app.use("/recommendations", recommendationRouter);
app.use(errorHandlerMiddleware);

export default app;
