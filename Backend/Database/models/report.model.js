import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['feedback_report', 'bug_report', 'abuse_report'],
        default: 'feedback_report'
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
        enum: ['User', 'Instructor', 'CodeReviewer', 'Challenge', 'Review'],
        required: true,
        index: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'targetType'
    },
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
export default Report;