import { Router } from "express";
const router = Router();

import {
  instructorSignup,
  instructorLogin,
  getAllInstructors,
  getInstructorById,
  updateInstructorProfile,
  deleteInstructor,
} from "./instructor.controller.js";

// AUTH
router.post("/", instructorSignup);
router.post("/login", instructorLogin);

// CRUD
router.get("/", getAllInstructors);
router.get("/:id", getInstructorById);
router.put("/:id", updateInstructorProfile);
router.delete("/:id", deleteInstructor);

export default router;