import joi from 'joi';

export const createResourceValidation = joi.object({
  title: joi.string().trim().min(3).required(),
  description: joi.string().trim().required(),
  type: joi.string().valid('free', 'paid').required(),
  url: joi.string().uri().trim().required(),
  instructor_id: joi.string().allow(null).default(null),
  resource_number: joi.number().min(1).required(),
});

export const updateResourceValidation = joi.object({
  title: joi.string().trim().min(3),
  description: joi.string().trim(),
  type: joi.string().valid('free', 'paid'),
  url: joi.string().uri().trim(),
  instructor_id: joi.string().allow(null).default(null),
  resource_number: joi.number().min(1)
}).min(1);

export const searchResourcesValidation = joi.object({
  title: joi.string().trim().min(3),
  type: joi.string().valid('free', 'paid'),
});