import mongoose from 'mongoose';

const verifyingEmailSchema = new mongoose.Schema({
    name: {
        type: String
    },
    type: {
        type: String,
        enum: ['user', 'instructor', 'code reviewer'],
        required: true
    },
    OTP: {
        type: String,
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(+new Date() + 15*60*1000),
        index: { expires: '0' }
    }
}, {
    timestamps: true
});

const VerifyingEmail = mongoose.model('VerifyingEmail', verifyingEmailSchema);
export default VerifyingEmail;