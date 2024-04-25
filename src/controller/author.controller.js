import { Author } from "../models/author.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerAuthor = asyncHandler(async (req, res) => {
  const { authorName, email, password } = req.body;
  if ([authorName, email, password].some((feilds) => feilds.trim() === ""))
    throw new ApiError(400, "Enter valid authorName, password or email ");
  const existedAuthor = await Author.findOne({ email });
  if (existedAuthor) throw new ApiError(401, "email already registered");
  const avatarLocalPath = req.files?.avatar?.[0].path;
  const coverImageLocalPath = req.files?.coverImage?.[0].path;
  // if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  // if (!avatar)
  //   throw new ApiError(500, "avatar couldn't be uploaded on cloudinary");
  const coverImage = uploadOnCloudinary(coverImageLocalPath);
  // if (!coverImage)
  //   throw new ApiError(500, "coverImage couldn't be uploaded on cloudinary");
  const author = Author.create({
    authorName,
    avatar: avatar.url || "",
    coverImage: coverImage.url || "",
    email,
    password,
  }).select("-password -refreshToken");
  const createdAuthor = Author.findById(author._id).select(
    "-password -refreshToken"
  );
  if (!createdAuthor)
    throw new ApiError(500, "Error while creating the author");
  res
    .status(200)
    .json(
      new ApiResponse(200, createdAuthor, "author registered successfully")
    );
});

export { registerAuthor };
