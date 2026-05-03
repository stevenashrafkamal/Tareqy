import mongoose from 'mongoose';
mongoose.set('debug', true); // Force Mongoose to log ALL queries to terminal

const trackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    languages: {
        type: [String],
        default: []
    },
    type: {
        type: String,
        enum: ['design', 'develop', 'testing', 'hacking', 'debugging']
    },
    compatibleTracks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Track'
    }],
    usages: {
        type: String,
        default: null
    },
    numberOfLevels: {
        type: Number,
        default: 0
    }
}, { 
    timestamps: true,
    collection: 'tracks' // Explicitly force the collection name
});

const Track = mongoose.models.Track || mongoose.model('Track', trackSchema, 'tracks');
export default Track;