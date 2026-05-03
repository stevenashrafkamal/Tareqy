import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    step_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Step",
        required: true
    },

    level_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Level",
        required: true
    },

    track_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Track",
        required: true
    },

    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "easy"
    },

    expected_output: {
        type: String
    },

    hints: [
        {
            type: String
        }
    ],

    is_active: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

export default mongoose.model("Task", taskSchema);