import "dotenv/config";
import express from "express";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import type { CorsOptions } from "cors";
import userRoutes from "./routes/userRoutes.js";
import docRoutes from "./routes/documentRoutes.js";
import connectCloudinary from "./config/cloudinary.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corOptions: CorsOptions = {
    origin: [
        "http://localhost:5173",
        "https://docubrain-1.onrender.com"
    ],
    credentials: true,
};
app.use(cors(corOptions));

app.use("/api/auth/user", userRoutes);
app.use("/api/auth/doc", docRoutes);

const startServer = async () => {
    try {
        await connectCloudinary();
        await connectDB();

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server Running At PORT ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();
