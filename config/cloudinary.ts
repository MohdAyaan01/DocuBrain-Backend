import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async (): Promise<typeof cloudinary> => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
        api_key: process.env.CLOUDINARY_API_KEY as string,
        api_secret: process.env.CLOUDINARY_API_SECRET as string,
    })
    return cloudinary;
}
export default connectCloudinary;