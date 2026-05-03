import Task from "../../database/models/task.model.js";
import AppError from "../../utils/AppError.js";

import "../../database/models/track.model.js";
import "../../database/models/level.model.js";
import "../../database/models/step.model.js";

export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find()
      .populate("track_id", "name")
      .populate("level_id", "name")
      .populate("step_id", "name");

    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("track_id", "name")
      .populate("level_id", "name")
      .populate("step_id", "name");

    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
};

export const getTasksByTrack = async (req, res, next) => {
  try {
    const tasks = await Task.find({ track_id: req.params.trackId })
      .populate("level_id", "name")
      .populate("step_id", "name");

    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

export const getTasksByLevel = async (req, res, next) => {
  try {
    const tasks = await Task.find({ level_id: req.params.levelId })
      .populate("track_id", "name")
      .populate("step_id", "name");

    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

export const getTasksByStep = async (req, res, next) => {
  try {
    const tasks = await Task.find({ step_id: req.params.stepId })
      .populate("track_id", "name")
      .populate("level_id", "name");

    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    res.status(200).json({ message: "Task updated", task });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return next(new AppError("Task not found", 404));
    }

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};
