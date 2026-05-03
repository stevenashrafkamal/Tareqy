import { Router } from "express";
import {
  createCheckpoint,
  updateCheckpoint,
  getUserCheckpoints,
  getCheckpointByTrack,
  deleteCheckpoint
} from "./checkpoint.controller.js";
import {
  createPointCheckpointValidation,
  updatePointCheckpointValidation
} from "../../validation/checkpoint.validation.js";
import { checkToken } from "../../Middlewares/checkToken.js";
import { validate } from "../../Middlewares/validate.js";

const checkPointRouter = Router();

checkPointRouter.post(
  "/",
  checkToken,
  validate(createPointCheckpointValidation),
  createCheckpoint
);
checkPointRouter.put(
  "/:id",
  checkToken,
  validate(updatePointCheckpointValidation),
  updateCheckpoint
);
checkPointRouter.get("/", checkToken, getUserCheckpoints);
checkPointRouter.get("/track/:trackId", checkToken, getCheckpointByTrack);
checkPointRouter.delete("/:id", checkToken, deleteCheckpoint);

export default checkPointRouter;