import express from "express";
import {
  getAll,
  getPlayerById,
  getPlayerByName,
  savePlayer,
  deletePlayer,
} from "./player.controller";

const router = express.Router();

router.get<{}, {}>("/", getAll);
router.get<{}, {}>("/:uniqueId", getPlayerById);
router.get<{}, {}>("/by-name/:name", getPlayerByName);
router.delete<{}, {}>("/:uniqueId", deletePlayer);
router.post<{}, {}>("/", savePlayer);

export default router;
