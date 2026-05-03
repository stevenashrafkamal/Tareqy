import joi from 'joi';

export const createSubmissionValidation = joi.object({
    type: joi.string().valid('task', 'challenge').required(),
    file_type: joi.string().trim().optional().valid('file', 'compressed', 'text'),
    submissionUrl: joi.string().trim().allow(null, ''),
    submission_url: joi.string().trim().allow(null, ''),
    challengeId: joi.string().trim().allow(null, ''),
    answer: joi.string().trim().allow(null, '')
});