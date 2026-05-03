import Step from "../../database/models/step.model.js";
import AppError from "../../utils/AppError.js";
import { Types } from "mongoose";

export async function createStep(req, res, next) {
  try {
    const step = await Step.create(req.body);
    res.status(201).json(step);
  } catch (err) {
    next(err);
  }
}

export const getAllSteps = async (req, res, next) => {
  try {
    const steps = await Step.find();
    res.json(steps);
  } catch (err) {
    next(err);
  }
};
// GET STEPS BY LEVEL
export async function getStepsByLevel(req, res, next) {
  try {
    const { levelId } = req.params;

    if (!Types.ObjectId.isValid(levelId)) {
      return next(new AppError("Invalid Level ID", 400));
    }

    const steps = await Step.find({ levelId: levelId }).sort({
      stepNumber: 1,
    });

    res.json(steps);
  } catch (err) {
    next(err);
  }
}

// GET STEP BY ID
export async function getStepById(req, res, next) {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid Step ID", 400));
    }

    const step = await Step.findById(id);

    if (!step) {
      return next(new AppError("Step not found", 404));
    }

    res.json(step);
  } catch (err) {
    next(err);
  }
}

// UPDATE
export async function updateStep(req, res, next) {
  try {
    const { id } = req.params;

    const step = await Step.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!step) {
      return next(new AppError("Step not found", 404));
    }

    res.json(step);
  } catch (err) {
    next(err);
  }
}

// DELETE
export async function deleteStep(req, res, next) {
  try {
    const { id } = req.params;

    const step = await Step.findByIdAndDelete(id);

    if (!step) {
      return next(new AppError("Step not found", 404));
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
}