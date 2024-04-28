import express, { Router } from "express";
import {
  logInAuthor,
  registerAuthor,
} from "../controller/author.controller.js";
import { uploads } from "../middlewares/multer.middleware.js";

const router = Router();
router.post(
  "/register",
  uploads.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cloudinary", maxCount: 1 },
  ]),
  registerAuthor
);
router.route("/login").post(logInAuthor);

export default router;
