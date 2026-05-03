import {Router} from 'express';
import jwt from 'jsonwebtoken';
import {
  reviewerSignup,
  reviewerLogin,
  verifyReviewerEmail,
  getReviewerProfile,
  updateReviewerProfile,
  selectTrack,
  selectLevels,
  getReviewerById,
  searchReviewers,
  activateReviewer,
  deactivateReviewer,
  deleteReviewer,
  changeReviewerPassword,
  reviewerLogout
} from './codeReviewer.controller.js';
import {
  reviewerSignupValidation,
  reviewerLoginValidation,
  updateReviewerProfileValidation,
  changeReviewerPasswordValidation,
  selectTrackValidation,
  selectLevelsValidation
} from '../../validation/reviewer.validation.js';
import { validate } from '../../Middlewares/validate.js';
import { checkToken } from '../../Middlewares/checkToken.js';

// Reviewer-specific auth: verifies tokens signed with ACCESS_TOKEN_SECRET
// (distinct from the user ACCESS token secret used by checkToken)
const reviewerAuth = (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Please login as a reviewer' });
    }
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const codeReviewerRouter = Router();

// Public routes — no auth required
codeReviewerRouter.post('/signup', validate(reviewerSignupValidation), reviewerSignup);
codeReviewerRouter.post('/login', validate(reviewerLoginValidation), reviewerLogin);
codeReviewerRouter.post('/verify-email', verifyReviewerEmail);
codeReviewerRouter.get('/search', searchReviewers);

// Reviewer-protected routes — require a valid reviewer JWT
codeReviewerRouter.get('/profile', reviewerAuth, getReviewerProfile);
codeReviewerRouter.put('/profile', reviewerAuth, validate(updateReviewerProfileValidation), updateReviewerProfile);
codeReviewerRouter.put('/select-track', reviewerAuth, validate(selectTrackValidation), selectTrack);
codeReviewerRouter.put('/select-levels', reviewerAuth, validate(selectLevelsValidation), selectLevels);
codeReviewerRouter.put('/change-password', reviewerAuth, validate(changeReviewerPasswordValidation), changeReviewerPassword);
codeReviewerRouter.post('/logout', reviewerAuth, reviewerLogout);

codeReviewerRouter.get('/:id', getReviewerById);

// Admin-protected routes — require a valid admin user JWT
codeReviewerRouter.put('/activate/:id', checkToken, activateReviewer);
codeReviewerRouter.put('/deactivate/:id', checkToken, deactivateReviewer);
codeReviewerRouter.delete('/:id', checkToken, deleteReviewer);
export default codeReviewerRouter;
