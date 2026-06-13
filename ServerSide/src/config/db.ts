import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in the environment');
        }
        await mongoose.connect(uri);
        console.log( 'MongoDB connected' );

    } catch (error) {
        console.log(error);
        process.exit(1)
        
    }
};


export default connectDB;