import express from 'express';
import {
  getUsers,
  deleteUser,
  activateUser,
  createTrack,
  deleteTrack,
  getReports,
  resolveReport,
  deleteReview,
  getSubmissions,
  approveInstructor,
  rejectInstructor,
  getPendingInstructors,
  changeUserRole,
  getStats,
  createStaff,
} from './admin.controller.js';

import { checkAdmin } from '../../Middlewares/checkAdmin.js';
import { isSuperAdmin } from '../../Middlewares/isSuperAdmin.js';
import { checkToken } from '../../Middlewares/checkToken.js';

const router = express.Router();

router.use(checkToken);
router.use(checkAdmin);


router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/activate', activateUser);


router.post('/tracks', createTrack);
router.delete('/tracks/:id', deleteTrack);


router.get('/reports', getReports);
router.patch('/reports/:id/resolve', resolveReport);


router.delete('/reviews/:id', deleteReview);


router.get('/submissions', getSubmissions);


router.patch(
  '/users/:id/role',
  checkAdmin ,
  isSuperAdmin, 
  changeUserRole
);
router.get('/instructors/pending', getPendingInstructors);

router.patch('/instructors/:id/approve', approveInstructor);

router.patch('/instructors/:id/reject', rejectInstructor);

// ── Stats & Staff Management ───────────────────────────────────────────────
router.get('/stats', getStats);
router.post('/create-staff', isSuperAdmin, createStaff);

export default router;