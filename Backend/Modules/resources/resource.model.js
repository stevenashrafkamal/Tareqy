import mongoose from 'mongoose';

/**
 * Resource Model
 *
 * A Resource is a learning asset (video, article, exercise) attached to a
 * Track, Level, or Step. It can be free or paid and optionally assigned
 * to an Instructor.
 */
const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
    },

    description: {
      type: String,
      required: [true, 'Resource description is required'],
      trim: true,
    },

    type: {
      type: String,
      enum: ['free', 'paid'],
      required: [true, 'Resource type is required'],
    },

    url: {
      type: String,
      required: [true, 'Resource URL is required'],
      trim: true,
    },

    resource_number: {
      type: Number,
      required: [true, 'Resource order number is required'],
      min: [1, 'Resource number must be at least 1'],
    },

    // Relational references (all optional — a resource may belong to any level of the hierarchy)
    track: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track',
      default: null,
    },

    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Level',
      default: null,
    },

    step: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Step',
      default: null,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes for the most common query patterns
resourceSchema.index({ track: 1, resource_number: 1 });
resourceSchema.index({ level: 1, resource_number: 1 });
resourceSchema.index({ step: 1, resource_number: 1 });
resourceSchema.index({ title: 'text', description: 'text' });

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
