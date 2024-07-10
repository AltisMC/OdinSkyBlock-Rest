import express from "express";
import { get, create, reply } from "./invite.controller";

const router = express.Router();

router.get<{}, {}>("/:player", get);
router.post<{}, {}>("/", create);
router.put<{}, {}>("/:player", reply);

export default router;
