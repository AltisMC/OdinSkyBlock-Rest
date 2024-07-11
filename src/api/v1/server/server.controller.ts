import { Request, Response, NextFunction } from "express";
import { SERVERS_KEY, PLAYERS_KEY } from "../../../constant/redis";
import asyncHandler from "express-async-handler";
import { redis } from "../../../index";
import { Server } from "./server.model";

const addServer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const server = Server.check(req.body);
      redis.hset(SERVERS_KEY, server.name, JSON.stringify(server));
      // clear the player list as well, can be helpful in case of a crash
      redis.del(PLAYERS_KEY.replace("<server-name>", server.name));

      res.status(200).json(server);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const removeServer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      redis.hdel(SERVERS_KEY, req.params.name);
      // clear the player list as well, can be helpful in case of a crash
      redis.del(PLAYERS_KEY.replace("<server-name>", req.params.name));

      res.status(200).json({ message: "Server removed successfully!" });
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const getAll = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const servers = Object.entries(await redis.hgetall(SERVERS_KEY));
      res.status(200).json(servers.map((s) => JSON.parse(s[1])));
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

// TODO: find a faster way to do this
const getLeastBusiest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const servers = Object.entries(await redis.hgetall(SERVERS_KEY));
      var leastBusiestServer = null;
      var min = Number.MAX_SAFE_INTEGER;
      for (let index = 0; index < servers.length; index++) {
        const data = servers[index];
        const server = Server.check(JSON.parse(data[1]));
        if (server.spawn && !req.body.spawn) {
          continue;
        } else if (!server.spawn && req.body.spawn) {
          continue;
        }

        const players = await redis.smembers(
          PLAYERS_KEY.replace("<server-name>", server.name)
        );

        if (players.length >= server.limit && !req.body.bypass) {
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
        console.log("returned");
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
      const redisData = await redis.hget(SERVERS_KEY, req.params.name);
      if (!redisData) {
        res
          .status(404)
          .json({ message: `Server not found for ${req.params.player}` });
        return;
      }

      const server = Server.check(JSON.parse(redisData));
      server.lastPing = Date.now();

      redis.hset(SERVERS_KEY, server.name, JSON.stringify(server));

      res.status(200).json(server);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

export { addServer, ping, getLeastBusiest, getAll, removeServer };
