import express from "express";
import {
  getLoadedIslands,
  saveIsland,
  deleteIsland,
  unloadIsland,
  loadIsland,
  createIsland,
} from "./island.controller";

const router = express.Router();

router.get<{}, {}>("/", getLoadedIslands);
router.get<{}, {}>("/:server", getLoadedIslands);
router.put<{}, {}>("/", loadIsland);
router.put<{}, {}>("/create", createIsland);
router.post<{}, {}>("/", saveIsland);
router.delete<{}, {}>("/unload", unloadIsland);
router.delete<{}, {}>("/", deleteIsland);

export default router;
