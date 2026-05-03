import joi from 'joi';
export const signupValidation = joi.object({
  username: joi.string().trim().min(3).required(),
  email: joi.string().email().trim().required(),
  password: joi.string().min(8).required(),
  preferred_choices: joi.array().items(joi.string()).default([])
});

export const loginValidation = joi.object({
  email: joi.string().email().trim().required(),
  password: joi.string().required()
});

export const updateProfileValidation = joi.object({
  username: joi.string().trim().min(3),
  email: joi.string().email().lowercase().trim(),
  preferred_choices: joi.array().items(joi.string())
}).min(1);

export const changePasswordValidation = joi.object({
  old_password: joi.string().required(),
  new_password: joi.string().min(8).required(),
  confirm_password: joi.string().valid(joi.ref('new_password')).required()
});

export const updatePreferredChoicesValidation = joi.object({
  preferred_choices: joi.array().items(joi.string()).required()
});

