import Track from "../../Database/models/track.model.js";
import Level from "../../Database/models/level.model.js";

export const createTrack = async (req, res) => {
  try {
    const {
      title,
      description,
      languages,
      type,
      compatible_tracks,
      usages
    } = req.body;
    if (compatible_tracks?.length) {
      const found = await Track.find({
        _id: { $in: compatible_tracks }
      });
      if (found.length !== compatible_tracks.length) {
        return res.status(400).json({
          message: "Some compatible tracks not found"
        });
      }
    }
    const track = await Track.create({
      title,
      description,
      languages,
      type,
      compatibleTracks: compatible_tracks,
      usages
    });
    res.status(201).json({
      message: "Track created successfully",
      track
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
export const getAllTracks = async (req, res) => {
  try {
    const tracks = await Track.find().sort({ createdAt: -1 });
    res.json({ tracks });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
export const getTrackById = async (req, res) => {
  try {
    const { id } = req.params;
    const track = await Track.findById(id)
      .populate("compatibleTracks");
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }
    res.json({ track });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const updateTrack = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const track = await Track.findById(id);
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }
    if (updates.compatible_tracks) {
      const found = await Track.find({
        _id: { $in: updates.compatible_tracks }
      });
      if (found.length !== updates.compatible_tracks.length) {
        return res.status(400).json({
          message: "Some compatible tracks not found"
        });
      }
      updates.compatibleTracks = updates.compatible_tracks;
    }
    Object.assign(track, updates);
    await track.save();
    res.json({
      message: "Track updated successfully",
      track
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const deleteTrack = async (req, res) => {
  try {
    const { id } = req.params;
    const track = await Track.findByIdAndDelete(id);
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }
    await Level.deleteMany({ trackId: id });
    res.json({ message: "Track and its levels deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const searchTracks = async (req, res) => {
  try {
    const { title, type } = req.query;
    const query = {};
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (type) {
      query.type = type;
    }
    const tracks = await Track.find(query);
    res.json({ tracks });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getTrackLevels = async (req, res) => {
  try {
    const { trackId } = req.params;
    const levels = await Level.find({ trackId })
      .sort({ levelNumber: 1 });
    res.json({ levels });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getCompatibleTracks = async (req, res) => {
  try {
    const { id } = req.params;
    const track = await Track.findById(id)
      .populate("compatibleTracks");
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }
    res.json({ compatibleTracks: track.compatibleTracks });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getTrackResources = async (req, res) => {
  try {
    res.json({
      message: "Track resources feature coming soon"
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getTrackChallenges = async (req, res) => {
  try {
    res.json({
      message: "Track challenges feature coming soon"
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};