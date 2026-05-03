import Submission from "../../Database/models/submission.model.js";

export const submitTask = async (req, res) => {
    try {
        const { type, fileType, submissionUrl, challengeId, answer } = req.body;
        const userId = req.user._id;    
        const newSubmission = new Submission({
            userId,
            type,
            fileType,
            submissionUrl,
            answer,
            challengeId: challengeId || null
        });
        await newSubmission.save();
        return res.status(201).json({message: 'Submission created successfully', data: newSubmission });
    } catch (error) {
        return res.status(500).json({ message: error.message, data: null });
    }   
};

export const submitChallenge = async (req, res) => {
    try {
        const { type, fileType, submissionUrl, challengeId, answer } = req.body;
        const userId = req.user._id;    
        const newSubmission = new Submission({
            userId,
            type,
            fileType: fileType || 'text',
            submissionUrl,
            answer,
            challengeId: challengeId || null
        });
        await newSubmission.save();
        return res.status(201).json({  message: 'Submission created successfully', data: newSubmission });
    } catch (error) {
        return res.status(500).json({  message: error.message, data: null });
    }   
};

export const getUserSubmissions = async (req, res) => {
    try {
        const userId = req.user._id;
        const submissions = await Submission.find({ userId }).populate('challengeId', 'content');
        return res.status(200).json({ message: 'Submissions retrieved successfully', data: submissions });
    } catch (error) {
        return res.status(500).json({ message: error.message, data: null });
    }
};

export const getSubmissionById = async (req, res) => {
    try {
        const submissionId = req.params.id;
        const submission = await Submission.findById(submissionId).populate('userId', 'username email').populate('challengeId', 'content');
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found', data: null });
        }
        return res.status(200).json({ message: 'Submission retrieved successfully', data: submission });
    } catch (error) {
        return res.status(500).json({ message: error.message, data: null });
    }
};

export const deleteSubmission = async (req, res) => {
    try {
        const submissionId = req.params.id;
        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found', data: null });
        }
        await Submission.findByIdAndDelete(submissionId);
        return res.status(200).json({ message: 'Submission deleted successfully', data: null });
    } catch (error) {
        return res.status(500).json({ message: error.message, data: null });
    }
};

export const getSubmissionsByChallenge = async (req, res) => {
    try {
        const { challengeId } = req.params;
        const submissions = await Submission.find({ challengeId }).populate('challengeId', 'content');
        return res.status(200).json({ message: 'Submissions retrieved successfully', data: submissions });
    } catch (error) {
        return res.status(500).json({ message: error.message, data: null });
    }
};

export const getPendingSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find({
            $or: [
                { status: 'pending' },
                { status: { $exists: false } },
                { status: null }
            ]
        })
            .populate('userId', 'username email Image')
            .populate('challengeId', 'title description')
            .sort({ createdAt: -1 });
        return res.status(200).json({ message: 'Pending submissions retrieved', data: submissions });
    } catch (error) {
        return res.status(500).json({ message: error.message, data: null });
    }
};

export const reviewSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reviewNote } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be "accepted" or "rejected"' });
        }

        const submission = await Submission.findByIdAndUpdate(
            id,
            {
                status,
                reviewedBy: req.user._id,
                reviewNote: reviewNote || ''
            },
            { new: true }
        ).populate('userId', 'username email').populate('challengeId', 'title');

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found', data: null });
        }

        return res.status(200).json({ message: `Submission ${status} successfully`, data: submission });
    } catch (error) {
        return res.status(500).json({ message: error.message, data: null });
    }
};

