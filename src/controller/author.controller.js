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
    console.log(error);
    throw new ApiError(
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
  if ([password, email].some((elements) => elements.trim() === "")) {
    throw new ApiError(400, "Enter valid email or password");
  }
  const author = await Author.findOne({ email });
  if (!author) throw new ApiError("author doesn't exist");
  const isPasswordCorrect = await author.isPasswordCorrect(password);
  if (!isPasswordCorrect)
    throw new ApiError(400, "Please Enter a valid password");
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    author._id
  );
  const loggedInAuthor = await Author.findById(author._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedInAuthor, accessToken, refreshToken },
        "author loggedIn successfully"
      )
    );
});

const authorLogout = asyncHandler(async (req, res) => {
  await Author.findByIdAndUpdate(
    req.author._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true, // making cookies Secure so that it can't modified from the frontend, only backend could modified that
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Author LoggedOut"));
});

export { registerAuthor, logInAuthor, authorLogout };
