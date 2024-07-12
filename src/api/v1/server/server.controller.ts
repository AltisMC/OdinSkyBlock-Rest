import { Request, Response, NextFunction } from "express";
import {
  ISLAND_UNLOAD_CHANNEL,
  ISLANDS_KEY,
  PLAYERS_KEY,
} from "../../../constant/redis";
import asyncHandler from "express-async-handler";
import { redis } from "../../../index";
import { Server } from "./server.model";

const addServer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const server = new Server(req.body);
      const validateErr = server.validateSync();
      if (validateErr) {
        res.status(500).json(validateErr);
        return;
      }

      await Server.replaceOne({ name: req.body.name }, req.body, {
        upsert: true,
      });

      res.status(200).json(server);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const removeServer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Server.deleteOne({ name: req.params.name });
      // clear the player and island list as well, can be helpful in case of a crash
      redis.del(PLAYERS_KEY.replace("<server-name>", req.params.name));

      const islandsData = Object.entries(await redis.hgetall(ISLANDS_KEY));
      for (let index = 0; index < islandsData.length; index++) {
        const data = islandsData[index]; // island's unique ID
        redis.hdel(ISLANDS_KEY, data[0]);
        redis.publish(ISLAND_UNLOAD_CHANNEL, data[0]);
      }

      res.status(200).json({ message: "Server removed successfully!" });
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const getAll = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const servers = await Server.find();
      res.status(200).json(servers);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

// TODO: find a faster way to do this
const getLeastBusiest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const servers = await Server.find();
      let leastBusiestServer = null;
      let min = Number.MAX_SAFE_INTEGER;
      for (const server of servers) {
        if (server.dead) continue;

        if (server.spawnServer && !Boolean(req.query.spawn)) {
          continue;
        } else if (!server.spawnServer && Boolean(req.query.spawn)) {
          continue;
        }

        const players = Object.entries(
          await redis.hgetall(PLAYERS_KEY.replace("<server-name>", server.name))
        );

        if (players.length >= server.limit && !Boolean(req.query.bypass)) {
          continue;
        }

        if (players.length <= min) {
          leastBusiestServer = server;
        }

        min = players.length;
      }

      if (!leastBusiestServer) {
        res
          .status(404)
          .json({ message: "Seems like all of the servers are full!" });
        return;
      }

      res.status(200).json(leastBusiestServer);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const ping = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const server = await Server.findOne({ name: req.params.name });
      if (!server) {
        res
          .status(404)
          .json({ message: `Server not found for ${req.params.name}` });
        return;
      }

      server.lastPing = Date.now();
      server.isNew = false;
      server.save();

      res.status(200).json(server);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

export { addServer, ping, getLeastBusiest, getAll, removeServer };
