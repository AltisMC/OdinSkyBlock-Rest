import { Schema, model } from "mongoose";

const IslandSchema = new Schema({
  uniqueId: { type: String, required: true, unique: true },
  ownerId: { type: String, required: true },
  creationTime: { type: Number, required: true, default: Date.now() },
  schematic: { type: String, required: true },
  normalLocation: { type: String, required: true },
  netherLocation: { type: String, required: true },
  endLocation: { type: String, required: true },
  visitorLocation: { type: String, required: true },
  centerLocation: { type: String, required: true },
  name: { type: String },
  description: { type: String },
  discord: { type: String },
  biome: { type: String, required: true, default: "PLAINS" },
  locked: { type: Boolean, default: false },
  worth: { type: Number, default: 0 },
  level: { type: Number, default: 0 },
});

export const Island = model("Island", IslandSchema);
