import { Boolean, String, Record } from "runtypes";

export const InviteReply = Record({
  player: String,
  island: String,
  accepted: Boolean,
});
