import express from "express";
import { message } from "./message.controller";

const router = express.Router();

router.post<{}, {}>("/", message);

export default router;
