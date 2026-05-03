import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['task', 'challenge'],
        required: true
    },
    fileType: {
        type: String,
        enum: ['file', 'compressed', 'text'],
        required: false
    },
    submissionUrl: {
        type: String
    },
    answer: {
        type: String
    },
    challengeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewNote: {
        type: String
    }
}, {
    timestamps: true
});

const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);
export default Submission;