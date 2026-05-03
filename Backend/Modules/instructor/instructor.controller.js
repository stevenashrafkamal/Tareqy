import Instructor from "../../Database/models/instructor.model.js";
import AppError from "../../utils/AppError.js";

import {
  instructorSignupValidation,
  instructorLoginValidation,
  updateInstructorProfileValidation,
} from "../../validation/instructor.validation.js";

export const instructorSignup = async (req, res, next) => {
  try {
    const { error } = instructorSignupValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const instructor = await Instructor.create(req.body);
    res.status(201).json(instructor);
  } catch (err) {
    next(err);
  }
};

export const instructorLogin = async (req, res, next) => {
  try {
    const { error } = instructorLoginValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const instructor = await Instructor.findOne({ email });

    if (!instructor || instructor.password !== password) {
      return next(new AppError("Invalid email or password", 401));
    }

    res.json({ message: "Login success", instructor });
  } catch (err) {
    next(err);
  }
};

export const getAllInstructors = async (req, res, next) => {
  try {
    const instructors = await Instructor.find();
    res.json(instructors);
  } catch (err) {
    next(err);
  }
};

export const getInstructorById = async (req, res, next) => {
  try {
    const instructor = await Instructor.findById(req.params.id);

    if (!instructor) {
      return next(new AppError("Instructor not found", 404));
    }

    res.json(instructor);
  } catch (err) {
    next(err);
  }
};

export const updateInstructorProfile = async (req, res, next) => {
  try {
    const { error } = updateInstructorProfileValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const instructor = await Instructor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!instructor) {
      return next(new AppError("Instructor not found", 404));
    }

    res.json(instructor);
  } catch (err) {
    next(err);
  }
};

export const deleteInstructor = async (req, res, next) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);

    if (!instructor) {
      return next(new AppError("Instructor not found", 404));
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    next(err);
  }
};