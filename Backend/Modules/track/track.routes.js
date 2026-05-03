import { Router } from "express";
import {
  createTrack,
  getAllTracks,
  getTrackById,
  updateTrack,
  deleteTrack,
  searchTracks,
  getTrackLevels,
  getCompatibleTracks,
  getTrackResources,
  getTrackChallenges
} from "./track.controller.js";
import {
  createTrackValidation,
  updateTrackValidation,
  searchTracksValidation
} from "../../validation/track.validation.js";
import { checkToken } from "../../Middlewares/checkToken.js";
import { checkAdmin } from "../../Middlewares/checkAdmin.js";
import { validate } from "../../Middlewares/validate.js";

const trackRouter = Router();

trackRouter.post("/", checkToken, checkAdmin, validate(createTrackValidation), createTrack);
trackRouter.get("/", getAllTracks);
trackRouter.get("/search", validate(searchTracksValidation), searchTracks);
trackRouter.get("/:id", getTrackById);
trackRouter.put("/:id", checkToken, checkAdmin, validate(updateTrackValidation), updateTrack);
trackRouter.delete("/:id", checkToken, checkAdmin, deleteTrack);
trackRouter.get("/:trackId/levels", getTrackLevels);
trackRouter.get("/:id/compatible", getCompatibleTracks);
trackRouter.get("/:id/resources", getTrackResources);
trackRouter.get("/:id/challenges", getTrackChallenges);

export default trackRouter;