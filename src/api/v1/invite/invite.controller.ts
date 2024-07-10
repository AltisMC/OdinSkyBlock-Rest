import { Request, Response, NextFunction } from "express";
import { INVITE_KEY, INVITE_REPLY_CHANNEL } from "../../../constants/redis";
import asyncHandler from "express-async-handler";
import { redis } from "../../../index";

const get = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const redisData = await redis.get(
        INVITE_KEY.replace("<player-uuid>", req.params.player)
      );
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
      const redisData = await redis.get(
        INVITE_KEY.replace("<player-uuid>", req.params.player)
      );
      if (!redisData) {
        res
          .status(404)
          .json({ message: `Invite not found for ${req.params.player}` });
        return;
      }

      const data = JSON.parse(redisData);

      redis.del(INVITE_KEY.replace("<player-uuid>", req.params.player));
      redis.publish(
        INVITE_REPLY_CHANNEL,
        JSON.stringify({
          player: data.player,
          island: data.island,
          accepted: req.body.accepted,
        })
      );

      res.status(200).json(req.body);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const create = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const redisData = await redis.get(
        INVITE_KEY.replace("<player-uuid>", req.body.player)
      );
      if (redisData) {
        res
          .status(409)
          .json({ message: `${req.body.player} already has an invite!` });
        return;
      }

      redis.set(
        INVITE_KEY.replace("<player-uuid>", req.body.player),
        JSON.stringify(req.body),
        "EX",
        req.body.time
      );

      res.status(201).json(req.body);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

export { get, reply, create };
