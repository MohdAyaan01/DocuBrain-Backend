import type { Request,Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import type {UploadApiResponse} from 'cloudinary'
import {Document}  from "../models/document.js";
import { GenerateSummary } from "../utils/gemini.js";
import { GenerateOllamaSummary } from "../utils/ollama.js";
import extractedText from "../utils/extract.js";

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

console.log("Cloudinary configured in documentController");

export const FileUpload = async (req: Request, res:Response) => {
    try {
        if ((!req as any).file) {
            console.log("No file provided");
            return res.status(400).json({ message: "PDF File Required", success: false })
        }

        console.log("Starting file upload...");
        console.log("File details:", (req as any).file.originalname, (req as any).file.size);

        let UploadResult;
        try {
            UploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "raw" },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary error:", error);
                            reject(error);
                        } else {
                            console.log("Cloudinary upload success");
                            resolve(result as UploadApiResponse);
                        }
                    }
                );
                stream.on('error', (err) => {
                    console.error("Stream error:", err);
                    reject(err);
                });
                stream.end((req as any).file!.buffer);
            })
        } catch (cloudErr:any) {
            console.error("Cloudinary upload failed:", cloudErr.message);
            throw cloudErr;
        }

        console.log("Extracting text...");
        const { text, totalPages } = await extractedText((req as any).file.buffer);
        console.log("Text extracted:", text.substring(0, 100) + "...", "Pages:", totalPages);

        console.log("Generating summary...");
        let aiSummary: string;
        if (process.env.NODE_ENV === "production") {
            console.log("Using Gemini for summary generation...");
            aiSummary = await GenerateSummary(text);
        } else {
            console.log("Using Local Ollama for summary generation...");
            aiSummary = await GenerateOllamaSummary(text);
        }
        console.log("Summary generated");

        console.log("Creating document in DB...");
        const document = await Document.create({
            userId: (req as any).id,
            fileName: (req as any).file.originalname,
            cloudURL: UploadResult.secure_url,
            cloudPublicId: UploadResult.public_id,
            extractedText: text,
            totalPages,
            summary: aiSummary
        })

        console.log("Document created successfully:", document._id);
        return res.status(201).json({
            message: "Document Uploaded Successfully",
            document,
            success: true
        })
    } catch (error:any) {
        console.error("FileUpload error - Full stack:", error);
        console.error("Error message:", error.message);
        console.error("Error details:", error);
        return res.status(500).json({
            message: "Upload Failed",
            success: false,
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
        })
    }
}
