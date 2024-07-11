import { Schema, model } from "mongoose";

const BankSchema = new Schema({
  islandId: { type: String, required: true },
  balance: { type: Number, required: true },
});

export const Bank = model("Bank", BankSchema);
