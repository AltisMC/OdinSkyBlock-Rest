import { Request, Response, NextFunction } from "express";
import {
  ISLAND_UNLOAD_CHANNEL,
  ISLANDS_KEY,
  PLAYERS_KEY,
} from "../../../constant/redis";
import asyncHandler from "express-async-handler";
import { redis } from "../../../index";
import { Player } from "./player.model";
import { Member } from "../member/member.model";

const savePlayer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const player = new Player(req.body);
      const validateErr = player.validateSync();
      if (validateErr) {
        res.status(500).json(validateErr);
        return;
      }

      Player.replaceOne({ uniqueId: req.body.uniqueId }, req.body, {
        upsert: true,
      }).exec();

      res.status(200).json(player);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const deletePlayer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      Player.deleteOne({ uniqueId: req.params.uniqueId }).exec();
      Member.deleteMany({ playerId: req.params.uniqueId }).exec();

      res.status(200).json({ message: "Player removed successfully!" });
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const getPlayerById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const player = await Player.findOne({ uniqueId: req.params.uniqueId });
      if (!player) {
        res.status(404).json({ message: "Player not found!" });
        return;
      }

      res.status(200).json(player);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const getPlayerByName = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const player = await Player.findOne({ name: req.params.name });
      if (!player) {
        res.status(404).json({ message: "Player not found!" });
        return;
      }

      res.status(200).json(player);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const getAll = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const players = await Player.find();
      res.status(200).json(players);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

export { savePlayer, deletePlayer, getAll, getPlayerById, getPlayerByName };
