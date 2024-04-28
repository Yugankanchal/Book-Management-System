import { Author } from "../models/author.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
export const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "unauthorized Request");
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const author = await Author.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!author) throw new ApiError(401, "Invalid access Token");
    req.author = author;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid access Token");
  }
});
