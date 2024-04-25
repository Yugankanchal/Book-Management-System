import cors from "cors";
import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // extended true -> nesting of objects
app.use(express.static("Public"));
app.use(cookieParser());

import authorRouter from "./routes/author.routes.js";

app.use("/api/v1/authors", authorRouter);

export default app;
