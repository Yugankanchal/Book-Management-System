import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    ISBNCode: {
      type: String,
      unique: true,
      required: true,
    },
    bookName: {
      type: String,
      required: true,
      unique: true,
    },
    publicationYear: {
      type: Number,
    },
    coverImage: {
      type: String,
      require: true,
    },
    issuedBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
