import {Router } from 'express';
import {
    createChallenge,
    getChallengeById,
    updateChallenge,
    deleteChallenge,
    getChallengeByTrack,
    getChallengeByLevel,
    getChallengeByStep,
    assignReviewer
} from './challenge.controller.js';
import {
    createChallengeValidation,
    updateChallengeValidation,
    assignReviewerValidation
} from '../../validation/challenge.valdation.js';
import { validate } from '../../Middlewares/validate.js';

const challengeRouter = Router();

challengeRouter.post('/', validate(createChallengeValidation), createChallenge);
challengeRouter.put('/:id', validate(updateChallengeValidation), updateChallenge);
challengeRouter.delete('/:id', deleteChallenge);
challengeRouter.get('/track/:trackId', getChallengeByTrack);
challengeRouter.get('/level/:levelId', getChallengeByLevel);
challengeRouter.get('/step/:stepId', getChallengeByStep);
challengeRouter.get('/:id', getChallengeById);
challengeRouter.put('/:id/reviewer', validate(assignReviewerValidation), assignReviewer);

export default challengeRouter;
