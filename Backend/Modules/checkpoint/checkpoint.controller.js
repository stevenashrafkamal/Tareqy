import Checkpoint from "../../Database/models/checkpoint.model.js";
import Track from "../../Database/models/track.model.js";
import Level from "../../Database/models/level.model.js";
import Step from "../../Database/models/step.model.js";

export const createCheckpoint = async (req, res) => {
  try {
    const { track_id, level_id, last_step_id } = req.body;
    const userId = req.user._id;
    const [track, level, step] = await Promise.all([
      Track.findById(track_id),
      Level.findById(level_id),
      Step.findById(last_step_id)
    ]);
    if (!track) return res.status(404).json({ message: "Track not found" });
    if (!level) return res.status(404).json({ message: "Level not found" });
    if (!step) return res.status(404).json({ message: "Step not found" });
    if (level.trackId.toString() !== track_id) {
      return res.status(400).json({ message: "Level does not belong to this track" });
    }
    if (step.levelId.toString() !== level_id) {
      return res.status(400).json({ message: "Step does not belong to this level" });
    }
    const checkpoint = await Checkpoint.findOneAndUpdate(
      { userId, trackId: track_id },
      {
        userId,
        trackId: track_id,
        levelId: level_id,
        lastStepId: last_step_id
      },
      {
        new: true,
        upsert: true
      }
    );
    res.status(200).json({
      message: "Checkpoint saved successfully",
      checkpoint
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const updateCheckpoint = async (req, res) => {
  try {
    const { id } = req.params;
    const { track_id, level_id, last_step_id } = req.body;
    const userId = req.user._id;

    const checkpoint = await Checkpoint.findOne({ _id: id, userId });
    if (!checkpoint) {
      return res.status(404).json({ message: "Checkpoint not found or unauthorized" });
    }
    const newTrackId = track_id || checkpoint.trackId;
    const newLevelId = level_id || checkpoint.levelId;
    const newStepId = last_step_id || checkpoint.lastStepId;
    const [track, level, step] = await Promise.all([
      Track.findById(newTrackId),
      Level.findById(newLevelId),
      Step.findById(newStepId)
    ]);
    if (!track) return res.status(404).json({ message: "Track not found" });
    if (!level) return res.status(404).json({ message: "Level not found" });
    if (!step) return res.status(404).json({ message: "Step not found" });
    if (level.trackId.toString() !== newTrackId.toString()) {
      return res.status(400).json({ message: "Level does not belong to this track" });
    }
    if (step.levelId.toString() !== newLevelId.toString()) {
      return res.status(400).json({ message: "Step does not belong to this level" });
    }
    checkpoint.trackId = newTrackId;
    checkpoint.levelId = newLevelId;
    checkpoint.lastStepId = newStepId;
    await checkpoint.save();
    res.json({
      message: "Checkpoint updated successfully",
      checkpoint
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getUserCheckpoints = async (req, res) => {
  try {
    const userId = req.user._id;
    const checkpoints = await Checkpoint.find({ userId })
      .populate("trackId")
      .populate("levelId")
      .populate("lastStepId")
      .sort({ updatedAt: -1 });
    res.json({ checkpoints });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getCheckpointByTrack = async (req, res) => {
  try {
    const { trackId } = req.params;
    const userId = req.user._id;
    const checkpoint = await Checkpoint.findOne({ userId, trackId })
      .populate("trackId levelId lastStepId");
    if (!checkpoint) {
      return res.status(200).json({ checkpoint: null });
    }
    res.json({ checkpoint });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const deleteCheckpoint = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const checkpoint = await Checkpoint.findOneAndDelete({ _id: id, userId });
    if (!checkpoint) {
      return res.status(404).json({ message: "Checkpoint not found or unauthorized" });
    }
    res.json({ message: "Checkpoint deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};