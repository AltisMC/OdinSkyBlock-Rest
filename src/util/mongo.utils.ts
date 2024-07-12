import { BankHistory } from "../api/v1/bank/bank.history.model";
import { Bank } from "../api/v1/bank/bank.model";

// METHODS RELATED TO BANK SYSTEM

export async function saveBank(bankData: any) {
  const bank = new Bank(bankData);
  const validateErr = bank.validateSync();
  if (validateErr) {
    throw validateErr;
  }

  await Bank.replaceOne({ islandId: bank.islandId }, bank, {
    upsert: true,
    bypassDocumentValidation: false,
  }).exec(); // can be run async, no need to wait
}

export async function saveBankHistory(islandId: string, histories: any) {
  if (!Array.isArray(histories)) {
    throw Error("You must provide a bank history list!");
  }

  if (
    histories.some((h) => {
      return new BankHistory(h).validateSync();
    })
  ) {
    throw Error("Invalid bank history format was found!");
  }

  histories = histories.map((h) => {
    return new BankHistory(h);
  });

  await BankHistory.deleteMany({ islandId: islandId });
  await BankHistory.bulkSave(histories, {
    bypassDocumentValidation: false,
  });
}

export async function clearBankHistory(islandId: string) {
  await BankHistory.deleteMany({ islandId: islandId });
}

export async function getBank(islandId: string): Promise<any> {
  return await Bank.findOne({ islandId: islandId });
}

export async function getBankHistory(islandId: string): Promise<any> {
  return await BankHistory.find({ islandId: islandId });
}
