import express, { Router } from "express";
import {
  userLogout,
  logInUser,
  registerUser,
} from "../controller/user.controller.js";
import { uploads } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();
router.post(
  "/register",
  uploads.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cloudinary", maxCount: 1 },
  ]),
  registerUser
);
router.post("/login", logInUser);

// Secured routes
router.post("/logout", verifyJwt, userLogout);
export default router;
