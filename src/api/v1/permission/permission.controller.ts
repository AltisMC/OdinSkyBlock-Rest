import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { Permission } from "./permission.model";

const updatePermissions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const permissions = req.body;
      if (!Array.isArray(permissions)) {
        res
          .status(500)
          .json({ message: "You must provide a permission list!" });
        return;
      }

      for (let index = 0; index < permissions.length; index++) {
        const permission = permissions[index];
        console.log(permission);
        Permission.replaceOne(
          {
            islandId: permission.islandId,
            permissionId: permission.permissionId,
          },
          permission,
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

const clearPermissions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Permission.deleteMany({ islandId: req.params.islandId });
      res.status(200).json({
        message: `Cleared permissions of island ${req.params.islandId}`,
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const getPermissions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .status(200)
        .json(await Permission.find({ islandId: req.params.islandId }));
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

export { getPermissions, updatePermissions, clearPermissions };
