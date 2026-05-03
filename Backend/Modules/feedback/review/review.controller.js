import Review from './review.model.js';
import catchAsync from '../../../utils/catchAsync.js';

export const createReview = catchAsync(async (req, res) => {
  const { total_stars, title, description, target_type, target_id } = req.body;

  const review = await Review.create({
    user:        req.user.id || req.user._id,
    rating:      total_stars,
    comment:     `${title} — ${description}`,
    relatedTo:   target_type,    
    referenceId: target_id,
  });

  res.status(201).json({
    status: 'success',
    data: review,
  });
});

export const getReviews = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.relatedTo)   filter.relatedTo   = req.query.relatedTo;
  if (req.query.referenceId) filter.referenceId = req.query.referenceId;

  const reviews = await Review.find(filter)
    .populate('user', 'username email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    results: reviews.length,
    data: reviews,
  });
});

export const updateReview = catchAsync(async (req, res) => {
  const update = {};
  if (req.body.total_stars  !== undefined) update.rating  = req.body.total_stars;
  if (req.body.description  !== undefined) update.comment = req.body.description;
  if (req.body.title        !== undefined) {
    update.comment = req.body.title + (req.body.description ? ` — ${req.body.description}` : '');
  }

  const review = await Review.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id || req.user._id },
    update,
    { returnDocument: 'after', runValidators: true }
  );

  if (!review) {
    return res.status(404).json({ message: 'Review not found or not yours to update' });
  }

  res.status(200).json({
    status: 'success',
    data: review,
  });
});

export const deleteReview = catchAsync(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  res.status(200).json({
    status: 'deleted',
    data: review,
  });
});