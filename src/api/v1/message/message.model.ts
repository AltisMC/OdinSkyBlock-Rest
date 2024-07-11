import { String, Record } from "runtypes";

export const Message = Record({
  player: String,
  island: String,
  message: String,
});
