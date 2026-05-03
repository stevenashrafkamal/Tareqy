import joi from 'joi';

export const reviewerSignupValidation = joi.object({
  username: joi.string().trim().min(3).required(),
  email: joi.string().email().trim().required(),
  password: joi.string().min(8).required(),
});

export const reviewerLoginValidation = joi.object({
  email: joi.string().email().trim().required(),
  password: joi.string().required(),
});

export const changeReviewerPasswordValidation = joi.object({
  old_password: joi.string().required(),
  new_password: joi.string().min(8).required(),
  confirm_password: joi.string().valid(joi.ref('new_password')).required()
});

export const updateReviewerProfileValidation = joi.object({
  username: joi.string().trim().min(3),
  email: joi.string().email().lowercase().trim(),
}).min(1);

export const selectTrackValidation = joi.object({
  selectedTrack: joi.string().trim().required()
});

export const selectLevelsValidation = joi.object({
    selectedLevels: joi.array().items(joi.string()).min(1).required()
});