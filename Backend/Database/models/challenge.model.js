import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema({
    trackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track',
        required: true
    },
    levelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Level',
        required: true
    },
    stepId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Step',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CodeReviewer'
    }
}, {
    timestamps: true
});

const Challenge = mongoose.model('Challenge', challengeSchema);
export default Challenge;