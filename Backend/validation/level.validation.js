import joi from 'joi';

export const createLevelValidation = joi.object({
  track_id: joi.string().trim().required(),
  level_number: joi.number().min(1).required(),
  level_difficulty: joi.string().valid('beginner', 'intermediate', 'advanced').required(),
});

export const updateLevelValidation = joi.object({
   level_id: joi.string().min(1),
    level_difficulty: joi.string().valid('beginner', 'intermediate', 'advanced'),
}).min(1);