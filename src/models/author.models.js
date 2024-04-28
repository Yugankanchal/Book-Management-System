import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
      required: true,
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
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

authorSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(this.password, password);
};

authorSchema.methods.generateAccessToken = () => {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      authorName: this.authorName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
authorSchema.methods.generateRefreshToken = () => {
  jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export const Author = mongoose.model("Author", authorSchema);
