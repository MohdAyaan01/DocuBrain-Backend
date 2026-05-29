import mongoose from "mongoose";

const connectDB = async ():Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Database Connected Successfully ...");
    } catch (err) {
        console.log("Database Connection Failed",err);
        process.exit(1);
    }
}
export default connectDB;