import express from "express";
import {
  getPermissions,
  clearPermissions,
  updatePermissions,
} from "./permission.controller";

const router = express.Router();

router.get<{}, {}>("/:islandId", getPermissions);
router.delete<{}, {}>("/:islandId", clearPermissions);
router.post<{}, {}>("/", updatePermissions);

export default router;
