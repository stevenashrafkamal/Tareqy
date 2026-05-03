import { Router } from "express";
import {
  createLevel,
  getLevelsByTrack,
  getLevelById,
  updateLevel,
  deleteLevel,
  getLevelSteps
} from "./level.controller.js";
import {
  createLevelValidation,
  updateLevelValidation
} from "../../validation/level.validation.js";
import { checkToken } from "../../Middlewares/checkToken.js"
import { checkAdmin } from "../../Middlewares/checkAdmin.js"
import { validate } from "../../Middlewares/validate.js";

const levelRouter = Router();

levelRouter.post(
  "/",
  checkToken,
  checkAdmin,
  validate(createLevelValidation),
  createLevel
);
levelRouter.get("/track/:trackId", getLevelsByTrack);
levelRouter.get("/:id", getLevelById);
levelRouter.put(
  "/:id",
  checkToken,
  checkAdmin,
  validate(updateLevelValidation),
  updateLevel
);
levelRouter.delete("/:id", checkToken, checkAdmin, deleteLevel);
levelRouter.get("/:levelId/steps", getLevelSteps);

export default levelRouter;