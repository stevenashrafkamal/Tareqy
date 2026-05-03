import joi from 'joi';

export const addScoreValidation = joi.object({
    user_id: joi.string().trim().required(),
    challenge_id: joi.string().trim().required(),
    submission_id: joi.string().trim().required(),
    score: joi.number().min(0).max(100).required(),
});

export const updateScoreValidation = joi.object({
    score: joi.number().min(0).max(100).required(),
}).min(1);