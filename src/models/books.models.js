import mongoose, { Schema } from "mongoose";

const bookSchema = new Schema(
  {
    book: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Author",
      },
    ],
    coverImage: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
