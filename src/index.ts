import express from "express";
import dotenv from "dotenv";
import Redis from "ioredis";
import mongoose from "mongoose";
import inviteRoute from "./api/v1/invite/invite.route";
import messageRoute from "./api/v1/message/message.route";
import serverRoute from "./api/v1/server/server.route";
import secretChecker from "./middleware/secret";
import logger from "morgan";
import { SERVERS_KEY, PLAYERS_KEY } from "./constant/redis";
import { Server } from "./api/v1/server/server.model";

dotenv.config();

const redis = new Redis(process.env.REDIS_URI!);
const port = process.env.PORT || 3000;
const app = express();

app.set("trust proxy", 1);
app.use(express.json());
app.use(logger("tiny"));
app.use(secretChecker);

app.use("/api/v1/invite", inviteRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/server", serverRoute);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("could not connect to mongo!");
    console.log(err.message);
  });

const checkDelay = parseInt(process.env.HEARTBEAT_CHECK_DELAY!);
const markDead = parseInt(process.env.MARK_DEAD_DELAY!);

async function checkHeartbeats() {
  const now = Date.now();
  const servers = Object.entries(await redis.hgetall(SERVERS_KEY));
  servers.map((data) => {
    const server = Server.check(JSON.parse(data[1]));
    if (now - server.lastPing > markDead) {
      console.log(
        `marking server "${server.name}" as dead. server was last pinged at: ${server.lastPing}`
      );
      redis.hdel(SERVERS_KEY, server.name);
      redis.del(PLAYERS_KEY.replace("<server-name>", server.name));
    }
  });
  setTimeout(checkHeartbeats, checkDelay);
}

checkHeartbeats();

export { redis };
