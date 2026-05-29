import express from "express";
import { FileUpload } from "../controllers/documentController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/fileupload", isAuthenticated, upload.single("file"), FileUpload)

export default router;