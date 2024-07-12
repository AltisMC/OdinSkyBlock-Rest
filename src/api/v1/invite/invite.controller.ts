import { Request, Response, NextFunction } from "express";
import { INVITE_KEY, INVITE_REPLY_CHANNEL } from "../../../constant/redis";
import asyncHandler from "express-async-handler";
import { redis } from "../../../index";
import { Invite } from "./invite.model";
import { InviteReply } from "./invitereply.model";
import {
  getInvite,
  invitePlayer,
  removeInvite,
  replyToInvite,
} from "../../../util/redis.utils";

const get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const redisData = await getInvite(req.params.player);
      if (!redisData) {
        res
          .status(404)
          .json({ message: `Invite not found for ${req.params.player}` });
        return;
      }

      res.status(200).json(redisData);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const reply = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const redisData = await getInvite(req.params.player);
      if (!redisData) {
        res
          .status(404)
          .json({ message: `Invite not found for ${req.params.player}` });
        return;
      }

      const json = JSON.parse(redisData);
      const data = InviteReply.check({
        player: json.player,
        island: json.island,
        accepted: req.body.accepted,
      });

      await removeInvite(json.player);
      await replyToInvite(data);

      res.status(200).json(req.body);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const create = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const redisData = await getInvite(req.body.player);
      if (redisData) {
        res
          .status(409)
          .json({ message: `${req.body.player} already has an invite!` });
        return;
      }

      const invite = Invite.check(req.body);
      invitePlayer(invite);

      res.status(201).json(invite);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

export { get, reply, create };
