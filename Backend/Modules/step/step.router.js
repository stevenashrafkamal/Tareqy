import { Router } from "express";
const router = Router();

import {
  createStep,
  getStepsByLevel,
  getStepById,
  getAllSteps,
  updateStep,
  deleteStep,
} from "./step.controller.js";
import validate from "../../middlewares/validate.middleware.js";

import {
  createStepValidation,
  updateStepValidation,
} from "../../validation/step.validation.js";

router.post("/", validate(createStepValidation), createStep);
router.get("/", getAllSteps);
router.get("/level/:levelId", getStepsByLevel);
router.get("/:id", getStepById);
router.put("/:id", validate(updateStepValidation), updateStep);

router.delete("/:id", deleteStep);

export default router;
