import express, { Router } from "express";
import {
  addBook,
  deleteBook,
  issueBook,
  returnBook,
} from "../controller/book.controller";
import { verifyJwt } from "../middlewares/auth.middleware";

const route = Router();

// securedRoutes
route.post("/add-book", verifyJwt, addBook);
route.post("/issue-book", verifyJwt, issueBook);
route.post("/return-book", verifyJwt, returnBook);
route.post("/delete-book", verifyJwt, deleteBook);
