import { Router } from 'express';
import reviewRouter from './review/review.route.js';
import reportRouter from './report/report.route.js';

export const feedbackRouter = Router();

feedbackRouter.use('/reviews', reviewRouter);
feedbackRouter.use('/reports', reportRouter);
