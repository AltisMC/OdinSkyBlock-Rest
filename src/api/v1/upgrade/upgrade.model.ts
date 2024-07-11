import { Schema, model } from "mongoose";

const UpgradeSchema = new Schema({
  islandId: { type: String, required: true },
  upgradeId: { type: String, required: true },
  level: { type: Number, required: true },
});

export const Upgrade = model("Upgrade", UpgradeSchema);
