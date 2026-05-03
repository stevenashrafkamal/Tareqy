import mongoose from 'mongoose';

const checkpointSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
    lastStepId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Step',
        required: true
    }
}, {
    timestamps: true
});

checkpointSchema.index({ userId: 1, trackId: 1 }, { unique: true });

const Checkpoint = mongoose.model('Checkpoint', checkpointSchema);
export default Checkpoint;