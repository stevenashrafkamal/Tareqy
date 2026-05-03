import express from 'express';
import {
  createReport,
  getReports,
  updateReportStatus,
  deleteReport,
} from './report.controller.js';
import { checkToken } from '../../../Middlewares/checkToken.js';
import { checkAdmin } from '../../../Middlewares/checkAdmin.js';
import { validate } from '../../../Middlewares/validate.js';
import { createReportValidation } from '../../../validation/report.validation.js';

const router = express.Router();

router.route('/')
  .post(checkToken, validate(createReportValidation), createReport)
  .get(checkToken, checkAdmin, getReports);

router.route('/:id')
  .patch(checkToken, checkAdmin, updateReportStatus)
  .delete(checkToken, checkAdmin, deleteReport);

export default router;