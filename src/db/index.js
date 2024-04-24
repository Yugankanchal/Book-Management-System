import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/DB_NAME`
    );
    console.log(
      `MongoDB Connected! DB Host ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default dbConnect;
