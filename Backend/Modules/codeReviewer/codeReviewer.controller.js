import bcrypt from 'bcrypt';
import { generateOTP } from '../../utils/generateOTP.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/generateToken.js';
import CodeReviewer from '../../Database/models/codeReviewer.model.js';
import { sendEmail } from '../../utils/sendEmail.js';
import VerifyingEmail from '../../Database/models/verifyingEmail.model.js';

export const reviewerSignup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingReviewer = await CodeReviewer.findOne({ email });
        if (existingReviewer) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const reviewer = await CodeReviewer.create({ username, email, password: hashedPassword });
        const OTP = generateOTP();
        await VerifyingEmail.create({ OTP, type: 'code reviewer', targetId: reviewer._id });
        await sendEmail(email, 'Verify your email', `<h1>Your OTP is: ${OTP}</h1>`);
        res.status(201).json({ message: 'Reviewer registered successfully', reviewer });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const reviewerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const reviewer = await CodeReviewer.findOne({ email });

        if (!reviewer) {
            return res.status(404).json({ message: 'Reviewer not found' });
        }
        if(!reviewer.activationStatus){
            return res.status(403).json({ message: 'Account not activated yet' });
        }
        if (reviewer.accountStatus === 'suspended') {
            return res.status(403).json({ message: 'Account is suspended' });
        }
        const isMatch = await bcrypt.compare(password, reviewer.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const accessToken = generateAccessToken({ id: reviewer._id, role: 'reviewer' });
        const refreshToken = generateRefreshToken({ id: reviewer._id, role: 'reviewer' });
        reviewer.refreshToken = refreshToken;
        await reviewer.save();
        res.status(200).json({ message: 'Login successful', accessToken, refreshToken });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const verifyReviewerEmail = async (req, res) => {
    try {
        const { targetId, OTP } = req.body;

        const OTPRecord = await VerifyingEmail.findOne({ targetId, OTP, type: 'code reviewer' });

        if (!OTPRecord) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        const reviewer = await CodeReviewer.findByIdAndUpdate(targetId, { activationStatus: true }, { returnDocument: 'after' });
        await VerifyingEmail.findByIdAndDelete(OTPRecord._id);
        res.status(200).json({ message: 'Email verified successfully', reviewer });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getReviewerProfile = async (req, res) => {
    try {
        const reviewer = await CodeReviewer.findById(req.user.id).select('-password -refreshToken');
        if (!reviewer) {
            return res.status(404).json({ message: 'Reviewer not found' });
        }
        res.status(200).json({ reviewer });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateReviewerProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    if (email) {
      const existingReviewer = await CodeReviewer.findOne({email,_id: { $ne: req.user.id }});
      if (existingReviewer) {
        return res.status(400).json({ success: false, message: 'Email already exists', data: null });
      }
    }

    const reviewer = await CodeReviewer.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { returnDocument: 'after' }
    ).select('-password -refreshToken');

    if (!reviewer) {
      return res.status(404).json({ success: false, message: 'Reviewer not found', data: null });
    }

    return res.status(200).json({ success: true, message: 'Profile updated successfully', data: reviewer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const selectTrack = async (req, res) => {
    try {
        const { selectedTrack } = req.body;
        const reviewer = await CodeReviewer.findByIdAndUpdate(
            req.user.id,
            { selectedTrack },
            { returnDocument: 'after' }
        ).select('-password -refreshToken');
        if (!reviewer) {
            return res.status(404).json({ message: 'Reviewer not found' });
        }
        res.status(200).json({ message: 'Track selected successfully', reviewer });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const selectLevels = async (req, res) => {
    try {
        const { selectedLevels } = req.body;
        const reviewer = await CodeReviewer.findByIdAndUpdate(
            req.user.id,
            { selectedLevels },
            { returnDocument: 'after' }
        ).select('-password -refreshToken');
        if (!reviewer) {
            return res.status(404).json({ message: 'Reviewer not found' });
        }
        res.status(200).json({ message: 'Levels selected successfully', reviewer });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getReviewerById = async (req, res) => {
    try {
        const reviewer = await CodeReviewer.findById(req.params.id).select('-password -refreshToken');
        if (!reviewer) {
            return res.status(404).json({ message: 'Reviewer not found' });
        }
        res.status(200).json({ reviewer });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const searchReviewers = async (req, res) => {
    try {
        const { username } = req.query;
        const reviewers = await CodeReviewer.find({ username: { $regex: username, $options: 'i' } }).select('-password -refreshToken');
        res.status(200).json({ reviewers });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export const activateReviewer = async (req, res) => {
  try {
    const { id } = req.params;

    const reviewer = await CodeReviewer.findByIdAndUpdate(
      id,
      { accountStatus: 'active' },
      { returnDocument: 'after' }
    ).select('-password -refreshToken');

    if (!reviewer) {
      return res.status(404).json({ success: false, message: 'Reviewer not found', data: null });
    }

    return res.status(200).json({ success: true, message: 'Reviewer activated successfully', data: reviewer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const deactivateReviewer = async (req, res) => {
  try {
    const { id } = req.params;

    const reviewer = await CodeReviewer.findByIdAndUpdate(
      id,
      { accountStatus: 'suspended' },
      { returnDocument: 'after' }
    ).select('-password -refreshToken');

    if (!reviewer) {
      return res.status(404).json({ success: false, message: 'Reviewer not found', data: null });
    }

    return res.status(200).json({ success: true, message: 'Reviewer deactivated successfully', data: reviewer });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const deleteReviewer = async (req, res) => {
  try {
    const { id } = req.params;

    const reviewer = await CodeReviewer.findByIdAndDelete(id);

    if (!reviewer) {
      return res.status(404).json({ success: false, message: 'Reviewer not found', data: null });
    }

    return res.status(200).json({ success: true, message: 'Reviewer deleted successfully', data: null });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};

export const changeReviewerPassword = async (req, res) => {
    try {
        const { old_password, new_password } = req.body;
        const reviewer = await CodeReviewer.findById(req.user.id);
        if (!reviewer) {
            return res.status(404).json({ message: 'Reviewer not found' });
        }
        const isMatch = await bcrypt.compare(old_password, reviewer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }
        reviewer.password = await bcrypt.hash(new_password, 10);
        await reviewer.save();
        res.status(200).json({ message: 'Password changed successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const reviewerLogout = async (req, res) => {
  try {
    await CodeReviewer.findByIdAndUpdate(req.user.id, { refreshToken: null });

    return res.status(200).json({ success: true, message: 'Logout successful', data: null });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
};
