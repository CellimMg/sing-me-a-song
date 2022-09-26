import { Router } from "express";
import { recommendationController } from "../controllers/recommendationController";

const testEnvironmentRouter = Router();

testEnvironmentRouter.post("/reset", recommendationController.reset);

export default testEnvironmentRouter;