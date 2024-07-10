import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
  const key = req.get("X-API-Secret");
  if (key != process.env.SECRET_KEY) {
    res
      .status(401)
      .json({ status: false, message: "Secret key is not valid!" });
    return;
  }

  next();
}
