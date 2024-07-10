import express from "express";
import dotenv from "dotenv";
import Redis from "ioredis";
import mongoose from "mongoose";
import inviteRoute from "./api/v1/invite/invite.route";
import messageRoute from "./api/v1/message/message.route";
import secretChecker from "./middleware/secret";
import logger from "morgan";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(logger("tiny"));
app.use(secretChecker);

app.use("/api/v1/invite", inviteRoute);
app.use("/api/v1/message", messageRoute);

mongoose
  .connect(process.env.MONGO_URI || "MONGO URI NOT FOUND")
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("could not connect to mongo!");
    console.log(err.message);
  });

export const redis = new Redis(process.env.REDIS_URI || "REDIS URI NOT FOUND");
