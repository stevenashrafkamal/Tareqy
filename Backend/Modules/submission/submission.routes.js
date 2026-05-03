import {Router} from "express";
import {
  submitTask,
    submitChallenge,
    getUserSubmissions,
    getSubmissionById,
    deleteSubmission,
    getSubmissionsByChallenge,
    getPendingSubmissions,
    reviewSubmission
} from "./submission.controller.js";
import { createSubmissionValidation } from "../../validation/submission.validation.js";
import { validate } from '../../Middlewares/validate.js';
import { checkToken } from '../../Middlewares/checkToken.js';
import { checkCodeReviewer } from '../../Middlewares/checkCodeReviewer.js';

const submissionRouter = Router();

submissionRouter.post('/submit',                    checkToken, validate(createSubmissionValidation), submitTask);
submissionRouter.post('/submit-challenge',          checkToken, validate(createSubmissionValidation), submitChallenge);
submissionRouter.get('/',                           checkToken, getUserSubmissions);
submissionRouter.get('/pending',                    checkCodeReviewer, getPendingSubmissions);
submissionRouter.put('/:id/review',                 checkCodeReviewer, reviewSubmission);
submissionRouter.get('/challenge/:challengeId',     checkToken, getSubmissionsByChallenge);
submissionRouter.get('/:id',                        checkToken, getSubmissionById);
submissionRouter.delete('/:id',                     checkToken, deleteSubmission);

export default submissionRouter;
