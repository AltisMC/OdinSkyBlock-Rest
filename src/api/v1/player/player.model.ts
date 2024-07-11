import { String, Record } from "runtypes";

export const Player = Record({
  name: String,
  uniqueId: String,
  server: String,
});
