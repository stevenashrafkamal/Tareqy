import mongoose from 'mongoose';
import validator from 'validator'

const codeReviewerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate:[validator.isEmail, 'Write it well']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    refreshToken: {
        type: String,
        default: null
    },
    activationStatus: {
        type: Boolean,
        default: false
    },
    accountStatus: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active'
    },
    selectedTrack: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track'
    },
    selectedLevels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Level'
    }]
}, {
    timestamps: true
});

const CodeReviewer = mongoose.model('CodeReviewer', codeReviewerSchema);
export default CodeReviewer;