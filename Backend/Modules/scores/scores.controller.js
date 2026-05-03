import { Score } from "../../Database/models/score.model.js";

export const addScore = async (req, res, next) => {
    try {
        const { user_id, challenge_id, score } = req.body;

        const newScore = await Score.create({
            user: user_id,
            challenge: challenge_id,
            submission: req.body.submission_id,
            score,
        });

        return res.status(201).json({ message: "Score added successfully", data: newScore });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "A score for this submission already exists." });
        }
        next(err);
    }
};

export const updateScore = async (req, res, next) => {
    try {
        const updatedScore = await Score.findByIdAndUpdate(
            req.params.id,
            { score: req.body.score },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedScore) {
            return res.status(404).json({ message: "Score not found" });
        }

        return res.status(200).json({ message: "Score updated successfully", data: updatedScore });
    } catch (err) {
        next(err);
    }
};

export const getScoreBySubmission = async (req, res, next) => {
    try {
        const score = await Score.findOne({ submission: req.params.submissionId })
            .populate("user", "username email");

        if (!score) {
            return res.status(404).json({ message: "No score found for this submission" });
        }

        return res.status(200).json({ data: score });
    } catch (err) {
        next(err);
    }
};

export const getUserScores = async (req, res, next) => {
    try {
        const scores = await Score.find({ user: req.params.userId })
            .populate("user", "username email")
            .sort({ createdAt: -1 });

        return res.status(200).json({ count: scores.length, data: scores });
    } catch (err) {
        next(err);
    }
};

export const getChallengeScores = async (req, res, next) => {
    try {
        const scores = await Score.find({ challenge: req.params.challengeId })
            .populate("user", "username email")
            .sort({ score: -1 });

        return res.status(200).json({ count: scores.length, data: scores });
    } catch (err) {
        next(err);
    }
};
