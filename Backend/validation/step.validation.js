import joi from 'joi';

export const createStepValidation = joi.object({
    username: joi.string().trim().min(2).required(),
  level_id: joi.string().trim().required(),
  track_id: joi.string().trim().required(),
  step_number: joi.number().min(1).required(),
  step_task: joi.string().trim().required(),
  step_challenge: joi.string().trim().allow(null).default(null)
});

export const updateStepValidation = joi.object({
    username: joi.string().trim().min(2),
  level_id: joi.string().trim(),
  track_id: joi.string().trim(),
  step_number: joi.number().min(1),
  step_task: joi.string().trim(),
  step_challenge: joi.string().trim().allow(null).default(null)
}).min(1);