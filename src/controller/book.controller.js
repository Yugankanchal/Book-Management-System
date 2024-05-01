import { User } from "../models/user.models";
import { Book } from "../models/books.models";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";

const addBook = asyncHandler(async (req, res) => {
  const { bookName, publicationYear, ISBNCode } = req.body;
  if (
    [bookName, publicationYear, ISBNCode].some((fields) => fields.trim() === "")
  ) {
    throw new ApiError(400, "Enter Fields Name Properly");
  }
  const existingBook = await Book.findOne(ISBNCode);
  if (!existingBook) throw ApiError(401, "Book already exists");
  const coverImageLocalPath = req.file?.coverImage?.path;
  const coverImage = uploadOnCloudinary(coverImageLocalPath);

  const book = await Book.create({
    bookName,
    publicationYear,
    ISBNCode,
    coverImage: coverImage.url,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, book, "Book added in DB successfully"));
});

const issueBook = asyncHandler(async (req, res) => {});

const returnBook = asyncHandler(async (req, res) => {});
const deleteBook = asyncHandler(async (req, res) => {});

export { issueBook, returnBook, addBook, deleteBook };
