import joi from 'joi';

export const generateOTPValidation = joi.object({
    user_id: joi.string().trim().required(),
    type: joi.string().valid('User', 'Instructor', 'CodeReviewer').required(),
});

export const verifyOTPValidation = joi.object({
    user_id: joi.string().trim().required(),
    otp: joi.string().trim().length(6).required(),
    type: joi.string().valid('User', 'Instructor', 'CodeReviewer').required(),
});

export const resendOTPValidation = joi.object({
    user_id: joi.string().trim().required(),
    type: joi.string().valid('User', 'Instructor', 'CodeReviewer').required(),
});