import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema({
    trackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track',
        required: true,
        index: true
    },
    levelNumber: {
        type: Number,
        required: true
    },
    levelDifficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    hasChallenge: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

levelSchema.index({ trackId: 1, levelNumber: 1 }, { unique: true });

const Level = mongoose.models.Level || mongoose.model('Level', levelSchema);

export default Level;