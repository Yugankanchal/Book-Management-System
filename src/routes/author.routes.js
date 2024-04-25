import express, { Router } from "express";
import { registerAuthor } from "../controller/author.controller.js";
import multer from "multer";

const upload = multer({ dest: "/public/temp" });

const router = Router();
router.post("/register", upload.single("avatar"), registerAuthor);

export default router;
