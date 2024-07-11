import { Request, Response, NextFunction } from "express";
import { CHAT_CHANNEL } from "../../../constant/redis";
import asyncHandler from "express-async-handler";
import { redis } from "../../../index";
import { Message } from "./message.model";

const message = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = Message.check(req.body);
      redis.publish(CHAT_CHANNEL, JSON.stringify(message));

      res.status(200).json(req.body);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

export { message };
