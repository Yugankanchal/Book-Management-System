import { Author } from "../models/author.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (author_id) => {
  try {
    const author = await Author.findById(author_id);
    const accessToken = author.generateAccessToken();
    const refreshToken = author.generateRefreshToken();
    author.refreshToken = refreshToken;
    await author.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw ApiError(
      500,
      "Something went wrong while generating accessToken and refreshToken"
    );
  }
};

const registerAuthor = asyncHandler(async (req, res) => {
  const { authorName, email, password } = req.body;
  console.log(req.files);
  if ([authorName, email, password].some((fields) => fields.trim() === ""))
    throw new ApiError(400, "Enter valid authorName, password or email ");
  const existedAuthor = await Author.findOne({ email });
  if (existedAuthor) throw new ApiError(401, "email already registered");
  const avatarLocalPath = req.files?.avatar?.[0].path;
  const coverImageLocalPath = req.files?.coverImage?.[0].path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar)
    throw new ApiError(500, "avatar couldn't be uploaded on cloudinary");
  const coverImage = uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage)
    throw new ApiError(500, "coverImage couldn't be uploaded on cloudinary");
  const author = await Author.create({
    authorName,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
  });
  const createdAuthor = await Author.findById(author._id).select(
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
const logInAuthor = asyncHandler(async (req, res) => {
  const { password, email } = req.body;
  if ([password, email].some((fields) => fields.trim() === "")) {
    throw new ApiError(400, "Enter valid email or password");
  }
  const author = await Author.findOne({ email }).select(
    "-password -refreshToken"
  );
  if (!author) throw new ApiError("author doesn't exist");
  const isPasswordCorrect = await author.isPasswordCorrect(password);
  if (!isPasswordCorrect)
    throw new ApiError(400, "Please Enter a valid password");
  const { accessToken, refreshToken } = generateAccessAndRefreshToken(
    author._id
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200));
});
export { registerAuthor, logInAuthor };
