import joi from 'joi';

export const instructorSignupValidation = joi.object({
  username: joi.string().trim().min(3).required(),
  email: joi.string().email().trim().required(),
  password: joi.string().min(8).required(),
});

export const instructorLoginValidation = joi.object({
  email: joi.string().email().trim().required(),
  password: joi.string().required(),
});

export const updateInstructorProfileValidation = joi.object({
  username: joi.string().trim().min(3),
  email: joi.string().email().lowercase().trim(),
}).min(1);

export const changeInstructorPasswordValidation = joi.object({
  old_password: joi.string().required(),
  new_password: joi.string().min(8).required(),
  confirm_password: joi.string().valid(joi.ref('new_password')).required()
});

export const selectTracksValidation = joi.object({
  selected_tracks: joi.array().items(joi.string()).min(1).required()
});

export const uploadCVValidation = joi.object({
  cv: joi.string().uri().required()
});
