import express from "express";
import {
  addServer,
  ping,
  getLeastBusiest,
  getAll,
  removeServer,
  disableServer,
} from "./server.controller";

const router = express.Router();

router.get<{}, {}>("/", getAll);
router.delete<{}, {}>("/:name", removeServer);
router.delete<{}, {}>("/disable/:name", disableServer);
router.get<{}, {}>("/least-busiest", getLeastBusiest);
router.post<{}, {}>("/", addServer);
router.put<{}, {}>("/:name", ping);

export default router;
