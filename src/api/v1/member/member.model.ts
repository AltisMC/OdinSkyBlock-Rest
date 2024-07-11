import { Schema, model } from "mongoose";

const MemberSchema = new Schema({
  islandId: { type: String, required: true },
  playerId: { type: String, required: true },
  role: {
    type: String,
    enum: ["BANNED", "VISITOR", "COOP", "MEMBER", "ADMIN", "OWNER"],
    required: true,
    default: "VISITOR",
  },
});

export const Member = model("Member", MemberSchema);
