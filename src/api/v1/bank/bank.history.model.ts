import { Schema, model } from "mongoose";

const BankHistorySchema = new Schema({
  islandId: { type: String, required: true },
  playerId: { type: String, required: true },
  amount: { type: Number, required: true },
  action: { type: String, enum: ["DEPOSIT", "WITHDRAW"], required: true },
  time: { type: Number, required: true, default: Date.now() },
});

export const BankHistory = model("BankHistory", BankHistorySchema);
