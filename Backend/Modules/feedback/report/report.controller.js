import Report from "./report.model.js";
import catchAsync from "../../../utils/catchAsync.js";

export const createReport = catchAsync(async (req, res) => {
  const { type, title, description, target_type, target_id } = req.body;

  const report = await Report.create({
    user:        req.user.id || req.user._id,
    reason:      title,
    description,
    relatedTo:   target_type,       
    referenceId: target_id,
    status:      'pending',
  });

  res.status(201).json({
    status: "success",
    data: report,
  });
});

export const getReports = catchAsync(async (req, res) => {
  const filter = {};
  if (req.query.status)    filter.status    = req.query.status;
  if (req.query.relatedTo) filter.relatedTo = req.query.relatedTo;

  const reports = await Report.find(filter)
    .populate("user", "username email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    results: reports.length,
    data: reports,
  });
});

export const updateReportStatus = catchAsync(async (req, res) => {
  const { status } = req.body;

  if (!['pending', 'resolved'].includes(status)) {
    return res.status(400).json({ message: "Status must be 'pending' or 'resolved'" });
  }

  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { status },
    { returnDocument: 'after' },
  );

  if (!report) {
    return res.status(404).json({ message: 'Report not found' });
  }

  res.status(200).json({
    status: "success",
    data: report,
  });
});

export const deleteReport = catchAsync(async (req, res) => {
  const report = await Report.findByIdAndDelete(req.params.id);

  if (!report) {
    return res.status(404).json({ message: 'Report not found' });
  }

  res.status(200).json({
    status: 'success',
    message: 'Report deleted successfully',
  });
});
