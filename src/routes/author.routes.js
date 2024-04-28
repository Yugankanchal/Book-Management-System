import express, { Router } from "express";
import {
  authorLogout,
  logInAuthor,
  registerAuthor,
} from "../controller/author.controller.js";
import { uploads } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
router.post(
  "/register",
  uploads.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cloudinary", maxCount: 1 },
  ]),
  registerAuthor
);
router.post("/login", logInAuthor);

// Secured routes
router.post("/logout", verifyJwt, authorLogout);
export default router;
