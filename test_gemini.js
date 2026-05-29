import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

(async () => {
    try {
        console.log("Testing Gemini API Key...");
        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is missing from .env");
            return;
        }

        const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const modelsToTest = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"];

        for (const modelName of modelsToTest) {
            console.log(`\nTesting model: ${modelName}...`);
            try {
                const model = genAi.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello!");
                const response = result.response.text();
                console.log(`${modelName} works! Response: ${response.substring(0, 30)}`);
            } catch (e) {
                console.error(`${modelName} failed: ${e.message}`);
            }
        }

    } catch (error) {
        console.error("Error:", error.message);
        if (error.response) {
            console.error("Error Details:", JSON.stringify(error.response, null, 2));
        }
    }
})();
