import dotenv from "dotenv";
import dbConnect from "./db/index.js";
import app from "./app.js";
dotenv.config({ path: "./.env" });

dbConnect()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`app running on the port : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongo DB connection failed", err);
  });
