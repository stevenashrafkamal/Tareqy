import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: String,
        enum: ['free', 'paid'],
        required: true
    },
    creatorType: {
        type: String,
        enum: ['Instructor'],
        required: true
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'creatorType'
    },
    resourceNumber: {
        type: String,
        default: null
    },
    freeUrl: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;