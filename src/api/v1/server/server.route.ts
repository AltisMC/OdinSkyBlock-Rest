import express from "express";
import {
  addServer,
  ping,
  getLeastBusiest,
  getAll,
  removeServer,
} from "./server.controller";

const router = express.Router();

router.get<{}, {}>("/", getAll);
router.delete<{}, {}>("/:name", removeServer);
router.get<{}, {}>("/least-busiest", getLeastBusiest);
router.post<{}, {}>("/", addServer);
router.put<{}, {}>("/:name", ping);

export default router;
