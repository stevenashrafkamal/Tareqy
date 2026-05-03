import joi from 'joi';

export const createChallengeValidation = joi.object({
  track_id: joi.string().trim().required(),
  level_id: joi.string().min(1).required(),
  step_id: joi.string().min(1).required(),
  content: joi.string().trim().required(),
  reviewer_id: joi.string().trim().allow(null).default(null),
});

export const updateChallengeValidation = joi.object({
  content: joi.string().trim(),
  reviewer_id: joi.string().trim().allow(null).default(null),
}).min(1);

export const assignReviewerValidation = joi.object({
  reviewer_id: joi.string().trim().required(),
});