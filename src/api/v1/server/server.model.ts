import { Schema, model } from "mongoose";

const ServerSchema = new Schema({
  name: { type: String, required: true, unique: true },
  spawnServer: { type: Boolean, required: true },
  spawnLocation: { type: String, required: false },
  limit: { type: Number, required: true, default: 100 },
  lastPing: { type: Number, required: true, default: Date.now() },
  dead: { type: Boolean, required: true, default: false },
});

export const Server = model("Server", ServerSchema);
