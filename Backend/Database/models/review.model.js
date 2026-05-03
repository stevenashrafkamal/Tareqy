import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    firstStars: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    targetType: {
        type: String,
        enum: ['Video', 'Instructor', 'Step', 'Level', 'Track', 'CodeReviewer'],
        required: true,
        index: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'targetType'
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

reviewSchema.index({ targetType: 1, targetId: 1, authorId: 1 }, { unique: true });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;