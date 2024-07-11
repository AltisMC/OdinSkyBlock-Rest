import express from "express";
import {
  updateMember,
  getMembers,
  getMember,
  clearMembers,
  removeMember,
} from "./member.controller";

const router = express.Router();

router.get<{}, {}>("/:islandId/:playerId", getMember);
router.delete<{}, {}>("/:islandId/:playerId", removeMember);
router.get<{}, {}>("/:islandId", getMembers);
router.delete<{}, {}>("/:islandId", clearMembers);
router.post<{}, {}>("/", updateMember);

export default router;
