import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { BankHistory } from "./bank.history.model";
import { Bank } from "./bank.model";
import {
  saveBank as saveBankToMongo,
  saveBankHistory as saveBankHistoryToMongo,
  clearBankHistory as clearBankHistoryFromMongo,
  getBank as getBankFromMongo,
  getBankHistory as getBankHistoryFromMongo,
} from "../../../util/mongo.utils";

const saveBank = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await saveBankToMongo(req.body);
      res.status(200).json(req.body);
    } catch (e) {
      // for some idiotic reason, printing out "e" return an empty object
      if (e instanceof Error) res.status(500).json({ error: e.message });
    }
  }
);

const saveBankHistory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await saveBankHistoryToMongo(req.params.islandId, req.body);
      res.status(200).json(req.body);
    } catch (e) {
      if (e instanceof Error) res.status(500).json({ error: e.message });
    }
  }
);

const clearHistory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      BankHistory.deleteMany({ islandId: req.params.islandId }).exec(); // can be run async, no need to wait
      res.status(200).json({
        message: `Cleared bank history of island ${req.params.islandId}`,
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const clearBank = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      clearBankHistoryFromMongo(req.params.islandId); // no need for await
      res.status(200).json({
        message: `Cleared bank of island ${req.params.islandId}`,
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const getBank = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bank = await getBankFromMongo(req.params.islandId);
      if (!bank) {
        res.status(404).json({
          message: `Could not find bank of island ${req.params.islandId}`,
        });
        return;
      }

      res.status(200).json(bank);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const getBankHistory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await getBankHistoryFromMongo(req.params.islandId));
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

export {
  getBank,
  getBankHistory,
  saveBank,
  saveBankHistory,
  clearBank,
  clearHistory,
};
