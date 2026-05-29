import multer, { type FileFilterCallback } from "multer";
import type { Request } from "express";
const storage = multer.memoryStorage();

const fileFilter = (req:Request,file:Express.Multer.File,cb:FileFilterCallback) =>{
    if(file.mimetype === "application/pdf"){
        cb(null,true)
    }else{
        cb(new Error("Only PDF Files Are Allowed"))
    }
};
const upload = multer({
    storage,
    limits:{
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter
});
export default upload