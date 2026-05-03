import Challenge from "../../Database/models/challenge.model.js";
import mongoose from "mongoose";

export const createChallenge = async (req, res) => {
    try {
        const { track_id, level_id, step_id, content } = req.body;
        const challenge = await Challenge.create({ trackId: track_id, levelId: level_id, stepId: step_id, content });
        res.status(201).json({ message: 'Challenge created successfully', challenge });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getChallengeById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Invalid challenge ID format' });
        }
        const challenge = await Challenge.findById(req.params.id)
            .populate('trackId', 'name')
            .populate('levelId', 'name')
            .populate('stepId', 'name')
            .populate('reviewerId', 'name email');
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        res.status(200).json({ challenge });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getChallengeByTrack = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.trackId)) {
            return res.status(404).json({ message: 'Invalid track ID format' });
        }
        const challenges = await Challenge.find({ trackId: req.params.trackId })
            .populate('levelId', 'levelNumber')
            .populate('stepId', 'name')
            .populate('reviewerId', 'username email');
        res.status(200).json({ challenges });
    }
    catch (error) { 
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getChallengeByLevel = async (req, res) => {
    try {
        const challenges = await Challenge.find({ levelId: req.params.levelId })
            .populate('trackId', 'name')
            .populate('stepId', 'name')
            .populate('reviewerId', 'username email');
        res.status(200).json({ challenges });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getChallengeByStep = async (req, res) => {
    try {
        const challenges = await Challenge.find({ stepId: req.params.stepId })
            .populate('trackId', 'name')
            .populate('levelId', 'name')
            .populate('reviewerId', 'username email');
        res.status(200).json({ challenges });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateChallenge = async (req, res) => {
    try {
        const { content, reviewer_id } = req.body;
        const challenge = await Challenge.findByIdAndUpdate(req.params.id, { content, reviewerId: reviewer_id }, { returnDocument: 'after' });
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        res.status(200).json({ message: 'Challenge updated successfully', challenge });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.findByIdAndDelete(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        res.status(200).json({ message: 'Challenge deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const assignReviewer = async (req, res) => {
    try {
        const { reviewer_id } = req.body;
        const challenge = await Challenge.findByIdAndUpdate(req.params.id, { reviewerId: reviewer_id }, { returnDocument: 'after' });
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found' });
        }
        res.status(200).json({ message: 'Reviewer assigned successfully', challenge });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
