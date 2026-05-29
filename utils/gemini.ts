import { GoogleGenerativeAI } from "@google/generative-ai"

const getGenAi = () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing from environment variables");
    }
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
}

export const GenerateSummary = async (text: string):Promise<string> => {
    console.log("Gemini: Initializing for summary...");
    const genAi = getGenAi();
    const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Summarize the following document in simple words: ${text}`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return response;
}
