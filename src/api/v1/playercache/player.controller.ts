import { Player } from "./player.model";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import {
  addPlayerToCache,
  clearPlayersCache,
  getPlayersFromCache,
  removePlayerFromCache,
} from "../../../util/redis.utils";

const addPlayer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const player = Player.check(req.body);
      await addPlayerToCache(player);
      res.status(200).json(player);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const removePlayer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await removePlayerFromCache(req.params.playerId);
      res.status(200).json({ message: "Removed player" });
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const getPlayers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const players = await getPlayersFromCache(req.params.server);
      res.status(200).json(players);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const clearPlayers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await clearPlayersCache(req.params.server);
      res.status(200).json({ message: "Cleared players cache!" });
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

export { getPlayers, addPlayer, removePlayer, clearPlayers };
