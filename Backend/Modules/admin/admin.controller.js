import { User } from "../../Database/models/user.js";
import Report from "../feedback/report/report.model.js";
import Review from "../feedback/review/review.model.js";
import Track from "../../Database/models/track.model.js";
import Submission from "../../Database/models/submission.model.js";
import Instructor from "../../Database/models/instructor.model.js";
import catchAsync from "../../utils/catchAsync.js";
import bcrypt from "bcrypt";

export const getUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.json({ data: users });
});

export const deleteUser = catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json();
});

export const activateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { account_status: "active" },
    { new: true },
  );

  res.json({ data: user });
});

export const createTrack = catchAsync(async (req, res) => {
  const track = await Track.create(req.body);

  res.status(201).json({ data: track });
});

export const deleteTrack = catchAsync(async (req, res) => {
  await Track.findByIdAndDelete(req.params.id);

  res.status(204).json();
});

export const getReports = catchAsync(async (req, res) => {
  const reports = await Report.find()
    .populate("user", "username email")
    .sort({ createdAt: -1 });

  res.json({ data: reports });
});

export const resolveReport = catchAsync(async (req, res) => {
  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { status: "resolved" },
    { new: true },
  );

  res.json({ data: report });
});

export const deleteReview = catchAsync(async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);

  res.status(204).json();
});

export const getSubmissions = catchAsync(async (req, res) => {
  const submissions = await Submission.find().populate("_id");

  res.json({ data: submissions });
});
export const changeUserRole = catchAsync(async (req, res) => {
  if (!req.user.isSuperAdmin) {
    return res.status(403).json({
      message: "Only super admin can change roles",
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.isSuperAdmin) {
    return res.status(403).json({
      message: "Cannot change super admin role",
    });
  }

  user.role = req.body.role;
  await user.save();

  res.json({ data: user });
});
export const approveInstructor = catchAsync(async (req, res) => {
  const instructor = await Instructor.findById(req.params.id);

  if (!instructor) {
    return res.status(404).json({ message: 'Instructor not found' });
  }

  instructor.accountStatus = 'approved';
  await instructor.save();

  res.json({
    message: 'Instructor approved',
    data: instructor,
  });
});
export const rejectInstructor = catchAsync(async (req, res) => {
  const instructor = await Instructor.findById(req.params.id);

  if (!instructor) {
    return res.status(404).json({ message: 'Instructor not found' });
  }

  instructor.accountStatus = 'rejected';
  await instructor.save();

  res.json({
    message: 'Instructor rejected',
    data: instructor,
  });
});
export const getPendingInstructors = catchAsync(async (req, res) => {
  const instructors = await Instructor.find({
    accountStatus: 'pending',
  });

  res.json({
    results: instructors.length,
    data: instructors,
  });
});

export const getStats = catchAsync(async (req, res) => {
  const [totalUsers, totalTracks, pendingReports, pendingSubmissions, totalReviews] =
    await Promise.all([
      User.countDocuments(),
      Track.countDocuments(),
      Report.countDocuments({ status: { $ne: 'resolved' } }),
      Submission.countDocuments({ $or: [{ status: 'pending' }, { status: { $exists: false } }] }),
      Review.countDocuments(),
    ]);

  res.json({
    data: { totalUsers, totalTracks, pendingReports, pendingSubmissions, totalReviews }
  });
});

export const createStaff = catchAsync(async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required: username, email, password, role' });
  }

  const allowedRoles = ['admin', 'codeReviewer'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Role must be "admin" or "codeReviewer"' });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ message: 'A user with this email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newStaff = await User.create({
    username,
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
    isConfirmed: true,   // Staff accounts are pre-confirmed
    account_status: 'active'
  });

  res.status(201).json({
    message: `${role === 'admin' ? 'Admin' : 'Code Reviewer'} created successfully`,
    data: { _id: newStaff._id, username: newStaff.username, email: newStaff.email, role: newStaff.role }
  });
});