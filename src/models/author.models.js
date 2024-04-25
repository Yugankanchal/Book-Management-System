import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
const authorSchema = new Schema(
  {
    authorName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      // required: true,
    },
    booksWritten: [
      {
        type: Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    coverImage: {
      type: String,
      // required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

authorSchema.pre("save", async function (next) {
  if (!this.isModified(this.password)) return next();
  this.password = await bcrypt(this.password, 10);
  return next();
});

authorSchema.methods.isPasswordCorrect = (password) => {
  return bcrypt.compare(this.password, password);
};

export const Author = mongoose.model("Author", authorSchema);
