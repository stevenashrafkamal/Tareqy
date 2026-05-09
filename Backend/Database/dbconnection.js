import mongoose from "mongoose";

export const dbconnection = async () => {
    try {
        const URI = "mongodb://127.0.0.1:27017/Tareqy";
        
        await mongoose.connect(URI);
        
        console.log("-----------------------------------------");
        console.log("✅ DB is successfully connected!");
        console.log("🎯 Connected Database Name:", mongoose.connection.name);
        console.log("-----------------------------------------");
        
    } catch (err) {
        console.error("❌ Failed to connect to MongoDB:", err.message);
    }
};
