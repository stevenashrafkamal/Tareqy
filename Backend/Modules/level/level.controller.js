import Level from "../../Database/models/level.model.js";
import Track from "../../Database/models/track.model.js";
import Step from "../../Database/models/step.model.js";

export const createLevel = async (req, res) => {
  try {
    const { track_id, level_number, level_difficulty } = req.body;
    const track = await Track.findById(track_id);
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }
    let finalLevelNumber = level_number;
    if (!finalLevelNumber) {
      const lastLevel = await Level.findOne({ trackId: track_id })
        .sort({ levelNumber: -1 });
      finalLevelNumber = lastLevel ? lastLevel.levelNumber + 1 : 1;
    }
    const existing = await Level.findOne({
      trackId: track_id,
      levelNumber: finalLevelNumber
    });
    if (existing) {
      return res.status(400).json({
        message: "Level already exists in this track"
      });
    }
    const level = await Level.create({
      trackId: track_id,
      levelNumber: finalLevelNumber,
      levelDifficulty: level_difficulty
    });
    res.status(201).json({
      message: "Level created successfully",
      level
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getLevelsByTrack = async (req, res) => {
  try {
    const { trackId } = req.params;
    const levels = await Level.find({ trackId })
      .sort({ levelNumber: 1 });
    res.json({ levels });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getLevelById = async (req, res) => {
  try {
    const { id } = req.params;
    const level = await Level.findById(id).populate("trackId");
    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }
    res.json({ level });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const updateLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { level_number, level_difficulty } = req.body;
    const level = await Level.findById(id);
    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }
    if (level_number) {
      const existing = await Level.findOne({
        trackId: level.trackId,
        levelNumber: level_number,
        _id: { $ne: id }
      });
      if (existing) {
        return res.status(400).json({
          message: "Level number already exists in this track"
        });
      }
      level.levelNumber = level_number;
    }
    if (level_difficulty) {
      level.levelDifficulty = level_difficulty;
    }
    await level.save();
    res.json({
      message: "Level updated successfully",
      level
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const deleteLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const level = await Level.findByIdAndDelete(id);
    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }
    await Step.deleteMany({ levelId: id });
    res.json({ message: "Level and its steps deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getLevelSteps = async (req, res) => {
  try {
    const { levelId } = req.params;
    const [level, steps] = await Promise.all([
      Level.findById(levelId),
      Step.find({ levelId }).sort({ createdAt: 1 })
    ]);
    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }
    res.json({ steps });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};