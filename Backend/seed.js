import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { User } from './Database/models/user.js';
import Track from './Database/models/track.model.js';
import Level from './Database/models/level.model.js';
import Step from './Database/models/step.model.js';
import Challenge from './Database/models/challenge.model.js';
import Instructor from './Database/models/instructor.model.js';
import CodeReviewer from './Database/models/codeReviewer.model.js';
import Resource from './Database/models/resource.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Tareqy';

async function seed() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected!');

        // 1. Clear existing data
        console.log('Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Track.deleteMany({}),
            Level.deleteMany({}),
            Step.deleteMany({}),
            Challenge.deleteMany({}),
            Instructor.deleteMany({}),
            CodeReviewer.deleteMany({}),
            Resource.deleteMany({})
        ]);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // 2. Create Admin & Users
        console.log('Creating users...');
        const admin = await User.create({
            username: 'admin',
            email: 'admin@tareqy.com',
            password: hashedPassword,
            role: 'admin',
            isConfirmed: true,
            isSuperAdmin: true
        });

        const student = await User.create({
            username: 'student1',
            email: 'student1@gmail.com',
            password: hashedPassword,
            role: 'user',
            isConfirmed: true
        });

        // 3. Create Tracks
        console.log('Creating tracks...');
        const frontendTrack = await Track.create({
            title: 'Frontend Development',
            description: 'Master modern frontend technologies including HTML, CSS, and Angular.',
            languages: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Angular'],
            type: 'develop',
            numberOfLevels: 3
        });

        const backendTrack = await Track.create({
            title: 'Backend Development',
            description: 'Build robust and scalable server-side applications with Node.js and MongoDB.',
            languages: ['JavaScript', 'Node.js', 'Express', 'MongoDB'],
            type: 'develop',
            numberOfLevels: 3
        });

        // 4. Create Levels for Frontend
        console.log('Creating levels...');
        const level1 = await Level.create({
            trackId: frontendTrack._id,
            levelNumber: 1,
            levelDifficulty: 'beginner'
        });

        // 5. Create Steps for Level 1
        console.log('Creating steps...');
        const step1 = await Step.create({
            levelId: level1._id,
            stepNumber: 1,
            title: 'Introduction to HTML',
            description: 'Learn the basics of HTML structure and tags.',
            content: 'In this step, we will cover tags like <html>, <head>, <body>, <h1>, and <p>.'
        });

        // 6. Create Instructor
        console.log('Creating instructor...');
        const instructor = await Instructor.create({
            username: 'ahmed_dev',
            email: 'ahmed@tareqy.com',
            password: hashedPassword,
            activationStatus: true,
            accountStatus: 'approved',
            selectedTracks: [frontendTrack._id]
        });

        // 7. Create Code Reviewer
        console.log('Creating code reviewer...');
        const reviewer = await CodeReviewer.create({
            username: 'reviewer_sara',
            email: 'sara@tareqy.com',
            password: hashedPassword,
            activationStatus: true,
            accountStatus: 'active',
            selectedTrack: frontendTrack._id,
            selectedLevels: [level1._id]
        });

        // 8. Create Challenge
        console.log('Creating challenge...');
        await Challenge.create({
            trackId: frontendTrack._id,
            levelId: level1._id,
            stepId: step1._id,
            content: 'Create a simple HTML page with a heading and a paragraph.',
            reviewerId: reviewer._id
        });

        // 9. Create Resource
        console.log('Creating resource...');
        await Resource.create({
            title: 'HTML Cheat Sheet',
            description: 'A handy guide for common HTML tags.',
            type: 'free',
            creatorType: 'Instructor',
            creatorId: instructor._id,
            freeUrl: 'https://example.com/html-cheat-sheet'
        });

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from database.');
    }
}

seed();
