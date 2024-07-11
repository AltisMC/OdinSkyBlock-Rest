import express from "express";
import {
  getUpgrades,
  clearUpgrades,
  updateUpgrades,
} from "./upgrade.controller";

const router = express.Router();

router.get<{}, {}>("/:islandId", getUpgrades);
router.delete<{}, {}>("/:islandId", clearUpgrades);
router.post<{}, {}>("/", updateUpgrades);

export default router;
