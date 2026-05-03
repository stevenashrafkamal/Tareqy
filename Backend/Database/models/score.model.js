import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        challenge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Challenge",
            required: true,
        },
        submission: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Submission",
            required: true,
        },
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

scoreSchema.index({ submission: 1 }, { unique: true });

export const Score = mongoose.model("Score", scoreSchema);
