import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { BankHistory } from "./bank.history.model";
import { Bank } from "./bank.model";

const saveBank = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      Bank.replaceOne({ islandId: req.body.islandId }, req.body, {
        upsert: true,
        bypassDocumentValidation: false,
      }).exec(); // can be run async, no need to wait

      res.status(200).json(req.body);
    } catch (e) {
      res.status(500).json(e);
    }
  }
);

const saveBankHistory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      var histories = req.body;
      if (!Array.isArray(histories)) {
        res
          .status(500)
          .json({ message: "You must provide a bank history list!" });
        return;
      }

      if (
        histories.some((h) => {
          return new BankHistory(h).validateSync();
        })
      ) {
        res.status(500).json({
          message: `Invalid bank history format was found!`,
        });
        return;
      }

      histories = histories.map((h) => {
        return new BankHistory(h);
      });

      BankHistory.deleteMany({ islandId: req.params.islandId })
        .exec()
        .then(() => {
          BankHistory.bulkSave(histories, {
            bypassDocumentValidation: false,
          });
        });

      res.status(200).json(histories);
    } catch (e) {
      res.status(500).json(e);
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
      Bank.deleteOne({ islandId: req.params.islandId }).exec(); // can be run async, no need to wait
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
      const bank = await Bank.findOne({ islandId: req.params.islandId });
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
      res
        .status(200)
        .json(await BankHistory.find({ islandId: req.params.islandId }));
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
