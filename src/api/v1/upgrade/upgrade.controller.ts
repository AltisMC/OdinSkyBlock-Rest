import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Upgrade } from "./upgrade.model";

const updateUpgrades = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const upgrades = req.body;
      if (!Array.isArray(upgrades)) {
        res.status(500).json({ message: "You must provide a upgrade list!" });
        return;
      }

      for (let index = 0; index < upgrades.length; index++) {
        const upgrade = upgrades[index];
        Upgrade.replaceOne(
          {
            islandId: upgrade.islandId,
            upgradeId: upgrade.upgradeId,
          },
          upgrade,
          {
            upsert: true,
          }
        ).exec(); // no need to wait for this action to be done
      }

      res.status(200).json(req.body);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const clearUpgrades = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Upgrade.deleteMany({ islandId: req.params.islandId });
      res.status(200).json({
        message: `Cleared upgrades of island ${req.params.islandId}`,
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const getUpgrades = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .status(200)
        .json(await Upgrade.find({ islandId: req.params.islandId }));
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

export { getUpgrades, updateUpgrades, clearUpgrades };
