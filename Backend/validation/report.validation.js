import joi from 'joi';

export const createReportValidation = joi.object({
  type: joi.string().valid('feedback', 'report').required(),
  title: joi.string().trim().min(3).required(),
  description: joi.string().trim().required(),
  target_type: joi.string().valid('video', 'instructor', 'reviewer', 'step', 'level', 'track').required(),
  target_id: joi.string().trim().required(),
});