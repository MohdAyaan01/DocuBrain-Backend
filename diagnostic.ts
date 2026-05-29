import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v2 as cloudinary } from 'cloudinary';

(async () => {
    console.log("SYSTEM DIAGNOSTIC");

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
        console.error("GEMINI_API_KEY is missing!");
        process.exit(1);
    } else {
        const masked = geminiKey.substring(0, 6) + "..." + geminiKey.substring(geminiKey.length - 4);
        console.log(`Loaded Gemini Key: ${masked}`);
    }

    console.log(`Cloudinary Cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);

    try {
        const genAi = new GoogleGenerativeAI(geminiKey);
        const model = genAi.getGenerativeModel({ model: "gemini-2.5-flash" });
        console.log("Testing Gemini (gemini-2.5-flash)...");
        const result = await model.generateContent("Hello");
        console.log("Gemini Success!");
    } catch (error:any) {
        console.error("Gemini Failed!");
        console.error(`Error Type: ${error.constructor.name}`);
        console.error(`Error Message: ${error.message}`);
        if (error.stack) {
            if (error.message.includes("429")) console.log("!! Quota/Rate Limit hit !!");
            if (error.message.includes("403")) console.log("!! Permission/API Key issue !!");
            if (error.message.includes("404")) console.log("!! Model Not Found !!");
        }
    }

    console.log("DIAGNOSTIC COMPLETE");
})();
