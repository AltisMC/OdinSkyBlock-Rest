import express from "express";
import dotenv from "dotenv";
import Redis from "ioredis";
import mongoose from "mongoose";
import inviteRoute from "./api/v1/invite/invite.route";
import messageRoute from "./api/v1/message/message.route";
import serverRoute from "./api/v1/server/server.route";
import playerRoute from "./api/v1/player/player.route";
import islandRoute from "./api/v1/island/island.route";
import memberRoute from "./api/v1/member/member.route";
import secretChecker from "./middleware/secret";
import logger from "morgan";
import {
  SERVERS_KEY,
  PLAYERS_KEY,
  ISLANDS_KEY,
  ISLAND_UNLOAD_CHANNEL,
} from "./constant/redis";
import { Server } from "./api/v1/server/server.model";
import { Member } from "./api/v1/member/member.model";

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
app.use("/api/v1/player", playerRoute);
app.use("/api/v1/island", islandRoute);
app.use("/api/v1/member", memberRoute);

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
  const servers = await Server.find();
  const islandsData = Object.entries(await redis.hgetall(ISLANDS_KEY));
  for (const server of servers) {
    if (server.dead) continue;

    if (now - server.lastPing > markDead) {
      console.log(
        `marking server "${server.name}" as dead. server was last pinged at: ${server.lastPing}`
      );
      server.isNew = false;
      server.dead = true;
      server.save();
      redis.del(PLAYERS_KEY.replace("<server-name>", server.name));

      for (let index = 0; index < islandsData.length; index++) {
        const data = islandsData[index]; // island's unique ID
        redis.hdel(ISLANDS_KEY, data[0]);
        redis.publish(ISLAND_UNLOAD_CHANNEL, data[0]);
        Member.deleteMany({ islandId: data[0] });
      }
    }
  }
  setTimeout(checkHeartbeats, checkDelay);
}

checkHeartbeats();

export { redis };
