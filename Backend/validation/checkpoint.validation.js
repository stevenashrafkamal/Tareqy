  import joi from 'joi';

  export const createPointCheckpointValidation = joi.object({
    track_id: joi.string().trim().required(),
    level_id: joi.string().min(1).required(),
    last_step_id: joi.string().trim().required(),
  });

  export const updatePointCheckpointValidation = joi.object({
    track_id: joi.string().trim(),
    level_id: joi.number().min(1),
    last_step_id: joi.number().min(1)
  }).min(1);