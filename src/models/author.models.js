import mongoose, { Schema } from "mongoose";

const authorSchema = new Schema(
  {
    authorName: {
      title: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    avatar: {
      type: String,
      require: true,
    },
    coverImage: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export const Author = mongoose.model("Author", authorSchema);
