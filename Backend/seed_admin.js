import mongoose from 'mongoose';
import { User } from './Database/models/user.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Tareqy');
        
        const existing = await User.findOne({ email: 'admin@tareqy.com' });
        if (existing) {
            console.log('Admin already exists.');
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new User({
            username: 'admin',
            email: 'admin@tareqy.com',
            password: hashedPassword,
            role: 'admin',
            isConfirmed: true
        });

        await admin.save();
        console.log('Admin user seeded: admin@tareqy.com / admin123');
    } catch (err) {
        console.error('Error seeding admin:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seedAdmin();
