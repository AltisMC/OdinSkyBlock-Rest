import { Number, String, Boolean, Record } from "runtypes";

export const Server = Record({
  name: String,
  spawn: Boolean,
  limit: Number,
  lastPing: Number,
});
