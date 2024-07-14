import express from "express";
import {
  getLoadedIslands,
  saveIsland,
  deleteIsland,
  unloadIsland,
  loadIsland,
  createIsland,
  getAll,
  get,
} from "./island.controller";

const router = express.Router();

router.get<{}, {}>("/:server?", getLoadedIslands);
router.get<{}, {}>("/all", getAll);
router.get<{}, {}>("/:id", get);
router.put<{}, {}>("/", loadIsland);
router.put<{}, {}>("/create/:server", createIsland);
router.post<{}, {}>("/", saveIsland);
router.delete<{}, {}>("/unload/:islandId", unloadIsland);
router.delete<{}, {}>("/:islandId", deleteIsland);

export default router;
