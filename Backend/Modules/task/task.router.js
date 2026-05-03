import { Router } from "express";

import {
  createTask,
  getAllTasks,
  getTaskById,
  getTasksByTrack,
  getTasksByLevel,
  getTasksByStep,
  updateTask,
  deleteTask,
} from "./task.controller.js";

const taskRouter = Router();

taskRouter.post("/", createTask);

taskRouter.get("/", getAllTasks);
taskRouter.get("/track/:trackId", getTasksByTrack);
taskRouter.get("/level/:levelId", getTasksByLevel);
taskRouter.get("/step/:stepId", getTasksByStep);
taskRouter.get("/:id", getTaskById);

taskRouter.put("/:id", updateTask);

taskRouter.delete("/:id", deleteTask);

export default taskRouter;
