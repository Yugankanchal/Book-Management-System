import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (user_id) => {
  try {
    const user = await User.findById(user_id);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "Something went wrong while generating accessToken and refreshToken"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  console.log(req.files);
  if ([userName, email, password].some((fields) => fields.trim() === ""))
    throw new ApiError(400, "Enter valid userName, password or email ");
  const existedUser = await User.findOne({ email });
  if (existedUser) throw new ApiError(401, "email already registered");
  const avatarLocalPath = req.files?.avatar?.[0].path;
  const coverImageLocalPath = req.files?.coverImage?.[0].path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar)
    throw new ApiError(500, "avatar couldn't be uploaded on cloudinary");
  const coverImage = uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage)
    throw new ApiError(500, "coverImage couldn't be uploaded on cloudinary");
  const user = await User.create({
    userName,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    email,
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) throw new ApiError(500, "Error while creating the user");
  res
    .status(200)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});
const logInUser = asyncHandler(async (req, res) => {
  const { password, email } = req.body;
  if ([password, email].some((elements) => elements.trim() === "")) {
    throw new ApiError(400, "Enter valid email or password");
  }
  const user = await User.findOne({ email });
  if (!user) throw new ApiError("user doesn't exist");
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect)
    throw new ApiError(400, "Please Enter a valid password");
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
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
        { loggedInUser, accessToken, refreshToken },
        "user loggedIn successfully"
      )
    );
});

const userLogout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
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
    .json(new ApiResponse(200, {}, "User LoggedOut"));
});

export { registerUser, logInUser, userLogout };
