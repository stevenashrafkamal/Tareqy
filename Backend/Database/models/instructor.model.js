import mongoose from 'mongoose';
import validator from 'validator'

const instructorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate:[validator.isEmail, 'Write it well']
        
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    activationStatus: {
        type: Boolean,
        default: false
    },
    accountStatus: {
        type: String,
        enum: ['active', 'suspended', 'pending', 'approved', 'rejected'],
        default: 'pending'
    },
    selectedTracks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track'
    }],
    CV: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const Instructor = mongoose.models.Instructor || mongoose.model('Instructor', instructorSchema);
export default Instructor;