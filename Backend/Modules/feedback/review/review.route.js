import express from 'express';
import {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
} from './review.controller.js';
import { checkToken } from '../../../Middlewares/checkToken.js';
import { checkAdmin } from '../../../Middlewares/checkAdmin.js';
import { validate } from '../../../Middlewares/validate.js';
import { addReviewValidation, updateReviewValidation } from '../../../validation/review.validation.js';

const router = express.Router();


router.route('/')
  .post(checkToken, validate(addReviewValidation), createReview)
  .get(getReviews);

router.route('/:id')
  .put(checkToken, validate(updateReviewValidation), updateReview)
  .delete(checkToken, checkAdmin, deleteReview);

export default router;