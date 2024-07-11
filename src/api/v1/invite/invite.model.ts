import { Number, String, Record } from "runtypes";

export const Invite = Record({
  player: String,
  island: String,
  time: Number,
});
