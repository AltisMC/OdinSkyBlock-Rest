import { IslandInfo } from "./island.info.model";
import { Request, Response, NextFunction } from "express";
import {
  ISLANDS_KEY,
  ISLAND_LOAD_CHANNEL,
  ISLAND_CREATE_CHANNEL,
  ISLAND_DELETE_CHANNEL,
  ISLAND_UNLOAD_CHANNEL,
} from "../../../constant/redis";
import asyncHandler from "express-async-handler";
import { redis } from "../../../index";
import { Island } from "./island.model";

// island is created but not loaded
const createIsland = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const redisIsland = await redis.hget(ISLANDS_KEY, req.body.uniqueId);
      if (redisIsland) {
        res.status(409).json({ message: "Island already exists!" });
        return;
      }

      const island = new Island(req.body);
      const validateErr = island.validateSync();
      if (validateErr) {
        res.status(500).json(validateErr);
        return;
      }

      await Island.replaceOne({ uniqueId: req.body.uniqueId }, req.body, {
        upsert: true,
      });

      res.status(200).json(req.body);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const loadIsland = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const island = IslandInfo.check(req.body);
      const redisIsland = await redis.hget(ISLANDS_KEY, island.uniqueId);
      if (redisIsland) {
        res.status(409).json({ message: "Island already exists!" });
        return;
      }

      redis.hset(ISLANDS_KEY, island.uniqueId, island.server);
      redis.publish(ISLAND_LOAD_CHANNEL, JSON.stringify(island));

      res.status(200).json(island);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const unloadIsland = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      redis.hdel(ISLANDS_KEY, req.body.uniqueId);
      redis.publish(ISLAND_UNLOAD_CHANNEL, req.body.uniqueId);

      res
        .status(200)
        .json({ message: `Successfully unloaded Island ${req.body.uniqueId}` });
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const deleteIsland = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      redis.hdel(ISLANDS_KEY, req.body.uniqueId);
      redis.publish(ISLAND_DELETE_CHANNEL, req.body.uniqueId);

      const deleted = await Island.deleteOne({ uniqueId: req.body.uniqueId });
      if (deleted.deletedCount > 0) {
        res.status(200).json({
          message: `Successfully deleted Island ${req.body.uniqueId}`,
        });
      } else {
        res.status(404).json({
          message: `Could not find island with ID of ${req.body.uniqueId}`,
        });
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const saveIsland = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Island.replaceOne({ uniqueId: req.body.uniqueId }, req.body, {
        upsert: true,
      });

      res
        .status(200)
        .json({ message: `Successfully saved island ${req.body.uniqueId}` });
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const getLoadedIslands = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let islands: any = [];
      const islandsData = Object.entries(await redis.hgetall(ISLANDS_KEY));

      if (!req.params.server) {
        for (let index = 0; index < islandsData.length; index++) {
          const data = islandsData[index];
          islands.push({ islandId: data[0], server: data[1] });
        }
      } else {
        for (let index = 0; index < islandsData.length; index++) {
          const data = islandsData[index];
          if (data[1] != req.params.server) continue;

          islands.push({ islandId: data[0], server: data[1] });
        }
      }

      res.status(200).json(islands);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

export {
  getLoadedIslands,
  saveIsland,
  deleteIsland,
  unloadIsland,
  loadIsland,
  createIsland,
};
