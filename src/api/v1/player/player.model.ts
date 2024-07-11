import { Schema, model } from "mongoose";

const PlayerSchema = new Schema({
  uniqueId: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  islandId: { type: String, required: false },
  islandCreation: { type: Number, required: true, default: 0 },
  chat: { type: Boolean, required: true, default: false },
  border: { type: Boolean, required: true, default: true },
  role: {
    type: String,
    enum: ["MEMBER", "ADMIN", "OWNER"],
    required: false,
    default: "MEMBER",
  },
});

export const Player = model("Player", PlayerSchema);
