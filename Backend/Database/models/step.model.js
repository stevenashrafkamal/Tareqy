import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
    levelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Level',
        required: true
    },
    stepNumber: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    videoUrl: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

stepSchema.index({ levelId: 1, stepNumber: 1 }, { unique: true });

const Step = mongoose.models.Step || mongoose.model('Step', stepSchema);
export default Step;