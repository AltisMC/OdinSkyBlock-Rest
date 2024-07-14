import { IslandInfo } from "./island.info.model";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import {
  getLoadedServer as getLoadedServerFromCache,
  loadIsland as sendLoadPacket,
  unloadIsland as sendUnloadPacket,
  deleteIsland as sendDeletePacket,
  getAllLoadedIslands,
} from "../../../util/redis.utils";
import {
  deleteIsland as deleteIslandFromMongo,
  createIsland as createIslandOnMongo,
  saveIsland as saveIslandToMongo,
  getAllIslands,
  getIsland,
} from "../../../util/mongo.utils";

// island is created but not loaded
const createIsland = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      createIslandOnMongo(req.body, req.params.server);
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
      const loadedIsland = await getLoadedServerFromCache(island.uniqueId);
      if (loadedIsland) {
        res.status(409).json({ message: "Island already loaded!" });
        return;
      }

      sendLoadPacket(island);
      res.status(200).json(island);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const getLoadedServer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const loadedServer = await getLoadedServerFromCache(req.params.id);
      if (!loadedServer) {
        res.status(404).json({ message: "Island is not loaded!" });
        return;
      }

      res.status(200).json({ server: loadedServer });
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const unloadIsland = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      sendUnloadPacket(req.params.islandId);
      res.status(200).json({
        message: `Successfully unloaded Island ${req.params.islandId}`,
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const deleteIsland = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      sendDeletePacket(req.params.islandId);
      const deleted = await deleteIslandFromMongo(req.params.islandId);
      if (deleted > 0) {
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
      saveIslandToMongo(req.body);
      res
        .status(200)
        .json({ message: `Successfully saved island ${req.body.uniqueId}` });
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const getAll = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await getAllIslands());
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await getIsland(req.params.id));
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const getLoadedIslands = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await getAllLoadedIslands(req.params.server));
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
  getAll,
  get,
  getLoadedServer,
};
