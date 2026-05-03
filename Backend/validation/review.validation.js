import joi from 'joi';

export const addReviewValidation = joi.object({
    total_stars: joi.number().min(1).max(5).required(),
    title: joi.string().trim().min(3).required(),
    description: joi.string().trim().required(),
    target_type:joi.string().valid('video', 'instructor', 'reviewer', 'step', 'level', 'track').required(),
    target_id: joi.string().trim().required(),
});

export const updateReviewValidation = joi.object({
    total_stars: joi.number().min(1).max(5),
    title: joi.string().trim().min(3),
    description: joi.string().trim(),
}).min(1);