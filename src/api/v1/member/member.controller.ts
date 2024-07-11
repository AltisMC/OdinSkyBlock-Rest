import { Request, Response, NextFunction } from "express";
import { ISLAND_MEMBER_UPDATE_CHANNEL } from "../../../constant/redis";
import asyncHandler from "express-async-handler";
import { redis } from "../../../index";
import { Member } from "./member.model";

const updateMember = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const member = new Member(req.body);
      const validateErr = member.validateSync();
      if (validateErr) {
        res.status(500).json(validateErr);
        return;
      }

      await Member.replaceOne(
        { playerId: req.body.playerId, islandId: req.body.islandId },
        req.body,
        {
          upsert: true,
        }
      );

      redis.publish(ISLAND_MEMBER_UPDATE_CHANNEL, JSON.stringify(member));

      res.status(200).json(req.body);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const clearMembers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Member.deleteMany({ islandId: req.params.islandId });
      res
        .status(200)
        .json({ message: `Cleared members of island ${req.params.islandId}` });
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const removeMember = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await Member.deleteOne({
        islandId: req.params.islandId,
        playerId: req.params.playerId,
      });
      if (deleted.deletedCount > 0) {
        res.status(200).json({
          message: `Removed member from island ${req.params.islandId}`,
        });
        return;
      }

      res.status(404).json({
        message: `User is already not a member of island ${req.params.islandId}`,
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const getMembers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .status(200)
        .json(await Member.find({ islandId: req.params.islandId }));
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const getMember = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const member = await Member.findOne({
        islandId: req.params.islandId,
        playerId: req.params.playerId,
      });

      if (!member) {
        res.status(404).json({
          message: `User is not a member of island ${req.params.islandId}`,
        });
        return;
      }

      res.status(200).json(member);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

export { getMember, getMembers, updateMember, clearMembers, removeMember };
