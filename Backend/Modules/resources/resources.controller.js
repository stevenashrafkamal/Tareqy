import mongoose from 'mongoose';
import Resource from './resource.model.js';
import catchAsync from '../../utils/catchAsync.js';

// ── CREATE ────────────────────────────────────────────────────────────────────

export const createResource = catchAsync(async (req, res) => {
  const { title, description, type, url, resource_number,
          track_id, level_id, step_id, instructor_id } = req.body;

  const resource = await Resource.create({
    title,
    description,
    type,
    url,
    resource_number,
    track:      track_id      || null,
    level:      level_id      || null,
    step:       step_id       || null,
    instructor: instructor_id || null,
  });

  res.status(201).json({
    status: 'success',
    data: resource,
  });
});

// ── READ ALL (with optional filters) ─────────────────────────────────────────

export const getAllResources = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.track_id)  filter.track  = req.query.track_id;
  if (req.query.level_id)  filter.level  = req.query.level_id;
  if (req.query.step_id)   filter.step   = req.query.step_id;
  if (req.query.type)      filter.type   = req.query.type;

  const resources = await Resource.find(filter)
    .populate('track',      'name')
    .populate('level',      'levelNumber')
    .populate('step',       'name')
    .populate('instructor', 'username email')
    .sort({ resource_number: 1 });

  res.status(200).json({
    results: resources.length,
    data: resources,
  });
});

// ── READ ONE ──────────────────────────────────────────────────────────────────

export const getResourceById = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid resource ID format' });
  }

  const resource = await Resource.findById(req.params.id)
    .populate('track',      'name')
    .populate('level',      'levelNumber')
    .populate('step',       'name')
    .populate('instructor', 'username email');

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.status(200).json({ data: resource });
});

// ── FULL-TEXT SEARCH ──────────────────────────────────────────────────────────

export const searchResources = catchAsync(async (req, res) => {
  const { title, type } = req.query;
  const filter = {};
  if (title) filter.$text = { $search: title };
  if (type)  filter.type  = type;

  const resources = await Resource.find(filter)
    .populate('track', 'name')
    .populate('level', 'levelNumber')
    .sort({ resource_number: 1 });

  res.status(200).json({
    results: resources.length,
    data: resources,
  });
});

// ── UPDATE ────────────────────────────────────────────────────────────────────

export const updateResource = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid resource ID format' });
  }

  const allowedFields = ['title', 'description', 'type', 'url', 'resource_number',
                         'track', 'level', 'step', 'instructor'];
  const update = {};

  // Map incoming body keys to model field names
  const fieldMap = {
    track_id: 'track', level_id: 'level',
    step_id: 'step', instructor_id: 'instructor',
  };

  Object.entries(req.body).forEach(([key, val]) => {
    const mapped = fieldMap[key] ?? key;
    if (allowedFields.includes(mapped)) update[mapped] = val;
  });

  if (Object.keys(update).length === 0) {
    return res.status(400).json({ message: 'No valid fields provided for update' });
  }

  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    { $set: update },
    { returnDocument: 'after', runValidators: true }
  );

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.status(200).json({
    status: 'success',
    data: resource,
  });
});

// ── DELETE ────────────────────────────────────────────────────────────────────

export const deleteResource = catchAsync(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid resource ID format' });
  }

  const resource = await Resource.findByIdAndDelete(req.params.id);

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found' });
  }

  res.status(200).json({
    status: 'success',
    message: 'Resource deleted successfully',
  });
});
