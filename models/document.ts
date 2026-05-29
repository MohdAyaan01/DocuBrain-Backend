import mongoose,{Document as MongooseDocument , Schema} from "mongoose";

interface IDocument extends MongooseDocument {
    userId: mongoose.Types.ObjectId,
    fileName:string,
    cloudURL: string,
    cloudPublicId: string,
    extractedText: string,
    totalPages: number,
    summary: string
}

const DocSchema = new Schema<IDocument>({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    fileName:{
        type: String,
        required: true,
    },
    cloudURL:{
        type: String,
        required: true,
    },
    cloudPublicId:{
        type: String,
        required: true,
    },
    extractedText:{
        type: String,
        required: true
    },
    totalPages:{
        type: Number,
        required: true
    },
    summary:{
        type: String,
        default: ""
    }
},{ timestamps: true });

export const Document = mongoose.model<IDocument>("Document", DocSchema);
