import express from 'express';
import {
  createResource,
  getAllResources,
  getResourceById,
  searchResources,
  updateResource,
  deleteResource,
} from './resources.controller.js';
import { checkToken }  from '../../Middlewares/checkToken.js';
import { checkAdmin }  from '../../Middlewares/checkAdmin.js';
import { validate }    from '../../Middlewares/validate.js';
import {
  createResourceValidation,
  updateResourceValidation,
} from '../../validation/resourses.validation.js';

const router = express.Router();

// GET  /api/resources/search — must be declared before /:id to avoid param collision
router.get('/search', searchResources);

router.route('/')
  .post(checkToken, checkAdmin, validate(createResourceValidation), createResource)
  .get(getAllResources);                        // Public — learners browse resources freely

router.route('/:id')
  .get(getResourceById)                        // Public
  .put(checkToken, checkAdmin, validate(updateResourceValidation), updateResource)
  .delete(checkToken, checkAdmin, deleteResource);

export default router;
