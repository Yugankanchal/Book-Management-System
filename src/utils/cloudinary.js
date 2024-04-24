import { v2 as cloudinary } from "cloudinary";
import { Console } from "console";
import fs from "fs";

cloudinary.config({
  cloud_name: "dvglyrq0w",
  api_key: "275671169429954",
  api_secret: "ixyV0D_JvefTfNAlxeDJ3Z-iHnM",
});
const uploadOnCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) return null;
    // upload on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // File has been uploaded
    console.log(`File have been uploaded on cloudinary`, response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFilePath); // remove the temporairy file as the upload operation got failed
    return null;
  }
};

export { uploadOnCloudinary };
