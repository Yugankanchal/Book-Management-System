import mongoose from "mongoose";
import DB_NAME from "../constant.js";
const dbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB Connected! DB Host ${connectionInstance.connection.host} with name ${DB_NAME}`
    );
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default dbConnect;
