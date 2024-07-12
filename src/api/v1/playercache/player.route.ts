import express from "express";
import {
  getPlayers,
  addPlayer,
  removePlayer,
  clearPlayers,
} from "./player.controller";

const router = express.Router();

router.get<{}, {}>("/", getPlayers);
router.get<{}, {}>("/:server", getPlayers);
router.post<{}, {}>("/", addPlayer);
router.delete<{}, {}>("/:playerId", removePlayer);
router.delete<{}, {}>("/clear/:server", clearPlayers);

export default router;
