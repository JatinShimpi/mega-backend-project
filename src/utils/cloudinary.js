import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("file uploaded on cloudinary succesfully", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); //remove the locally saved temp file as the upload operation failed
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      console.log("no publiciD PROVIDED, SKIPPING DELETITION");
      return null;
    }
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: "auto",
    });

    if (response.result === "ok") {
      console.log("File deleted from Cloudinary successfully:", publicId);
    } else {
      console.log("File not found or already deleted:", publicId);
    }

    return response;
  } catch (error) {
    console.log("error while deleting file from cloudinary", error);
    throw error;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };

const uploadResult = await cloudinary.uploader
  .upload(
    "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
    {
      public_id: "shoes",
    },
  )
  .catch((error) => {
    console.log(error);
  });

console.log(uploadResult);
