import joi from 'joi';

export const createTrackValidation = joi.object({
  title: joi.string().trim().min(2).required(),
  languages: joi.array().items(joi.string()).default([]),
  type: joi.string()
    .valid('design', 'develop', 'testing', 'hacking', 'debugging')
    .required(),
  compatible_tracks: joi.array()
    .items(joi.string().trim())
    .default([]),
  usages: joi.string().default(null),
  number_of_levels: joi.number().min(0).default(0)
});

export const updateTrackValidation = joi.object({
  title: joi.string().trim().min(2),
  languages: joi.array().items(joi.string()),
  type: joi.string().valid('design', 'develop', 'testing', 'hacking', 'debugging'),
  compatible_tracks: joi.array().items(joi.string().trim()),
  usages: joi.string(),
  number_of_levels: joi.number().min(0)
}).min(1);

export const searchTracksValidation = joi.object({
  title: joi.string().trim().min(2),
  type: joi.string().valid('design', 'develop', 'testing', 'hacking', 'debugging'), 
})