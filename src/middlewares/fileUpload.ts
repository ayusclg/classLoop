import multer from "multer";
import cloudinary, { UploadApiResponse } from "cloudinary"



cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const Storage = multer.memoryStorage()
export const Upload = multer({
    storage: Storage,
    limits: {
        fileSize:5*1024*1024
    }
})


 export const uploadImage = async (file: Express.Multer.File): Promise<String> =>{
    try {
        const b64 = Buffer.from(file.buffer).toString("base64")
        const dataUri = `data${file.mimetype};b64${b64}`

        const result: UploadApiResponse = await cloudinary.v2.uploader.upload(dataUri)
        return result.secure_url
    } catch (error) {
        console.log(error)
        throw new Error("Error uploading file to Cloudinary");
    }
}