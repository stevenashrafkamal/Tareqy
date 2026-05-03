import mongoose from 'mongoose';
import { User } from './Database/models/user.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Tareqy');
        const count = await User.countDocuments();
        console.log(`Total users in DB: ${count}`);
        if (count > 0) {
            const users = await User.find({}, 'email username isConfirmed');
            console.log('Users:', JSON.stringify(users, null, 2));
        } else {
            console.log('No users found in database.');
        }
    } catch (err) {
        console.error('Error checking users:', err);
    } finally {
        await mongoose.disconnect();
    }
}

checkUsers();
