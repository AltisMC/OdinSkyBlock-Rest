import express from "express";
import {
  getBank,
  getBankHistory,
  saveBank,
  saveBankHistory,
  clearBank,
  clearHistory,
} from "./bank.controller";

const router = express.Router();

router.get<{}, {}>("/history/:islandId", getBankHistory);
router.get<{}, {}>("/:islandId", getBank);

router.post<{}, {}>("/history/:islandId", saveBankHistory);
router.post<{}, {}>("/", saveBank);

router.delete<{}, {}>("/history/:islandId", clearHistory);
router.delete<{}, {}>("/:islandId", clearBank);

export default router;
