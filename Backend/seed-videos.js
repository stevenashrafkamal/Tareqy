import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Step from './Database/models/step.model.js';

dotenv.config();

const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/tareqy';

const videos = [
  { titleMatch: /Angular Beginner/i, url: "https://www.youtube.com/embed/k5E2AVpwsko" },
  { titleMatch: /Angular Advanced/i, url: "https://www.youtube.com/embed/Ata9cSC2WpM" },
  { titleMatch: /Node.js Basics/i, url: "https://www.youtube.com/embed/TlB_eWDSMt4" },
  { titleMatch: /Node.js API/i, url: "https://www.youtube.com/embed/ENrzD9HAZK4" }
];

async function seedVideos() {
  try {
    await mongoose.connect(DB_URL);
    console.log('⚓ Connected to MongoDB');
    
    for (const v of videos) {
      const result = await Step.updateMany(
        { title: v.titleMatch },
        { $set: { videoUrl: v.url } }
      );
      console.log(`Updated ${result.modifiedCount} steps matching ${v.titleMatch}`);
    }
    
    // Also update any step that has 'video' in the title but didn't match the above
    const generic = await Step.updateMany(
      { title: /video|lesson/i, videoUrl: { $exists: false } },
      { $set: { videoUrl: "https://www.youtube.com/embed/TlB_eWDSMt4" } }
    );
    console.log(`Updated ${generic.modifiedCount} generic steps as a fallback`);

    console.log('✅ Video Seed Complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
}

seedVideos();
