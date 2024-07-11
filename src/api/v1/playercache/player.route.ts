import express from "express";
import { getPlayers, addPlayer, removePlayer } from "./player.controller";

const router = express.Router();

router.get<{}, {}>("/", getPlayers);
router.get<{}, {}>("/:server", getPlayers);
router.post<{}, {}>("/", addPlayer);
router.delete<{}, {}>("/", removePlayer);

export default router;
