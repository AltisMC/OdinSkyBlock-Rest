import { Player } from "./player.model";
import { Request, Response, NextFunction } from "express";
import { SERVERS_KEY, PLAYERS_KEY } from "../../../constant/redis";
import asyncHandler from "express-async-handler";
import { redis } from "../../../index";
import { Server } from "../server/server.model";

const addPlayer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const player = Player.check(req.body);
      redis.hset(
        PLAYERS_KEY.replace("<server-name>", player.server),
        player.uniqueId,
        JSON.stringify(player)
      );

      res.status(200).json(player);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const removePlayer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const player = Player.check(req.body);
      redis.srem(
        PLAYERS_KEY.replace("<server-name>", player.uniqueId),
        JSON.stringify(player)
      );

      res.status(200).json(player);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const getPlayers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.params.server) {
        const servers = Object.entries(await redis.hgetall(SERVERS_KEY));
        for (let index = 0; index < servers.length; index++) {
          const data = servers[index];
          const players = Object.entries(
            await redis.hgetall(PLAYERS_KEY.replace("<server-name>", data[0]))
          );
          res.status(200).json(players.map((server) => JSON.parse(server[1])));
          return;
        }
      }

      const players = Object.entries(
        await redis.hgetall(
          PLAYERS_KEY.replace("<server-name>", req.params.server)
        )
      );
      res.status(200).json(players.map((server) => JSON.parse(server[1])));
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

export { getPlayers, addPlayer, removePlayer };
