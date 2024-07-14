import { BankHistory } from "../api/v1/bank/bank.history.model";
import { Bank } from "../api/v1/bank/bank.model";
import { Island } from "../api/v1/island/island.model";
import { Member } from "../api/v1/member/member.model";
import {
  getLoadedServer,
  createIsland as sendCreatePacket,
} from "./redis.utils";

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

// METHODS RELATED TO ISLAND SYSTEM

export async function createIsland(islandData: any, server: string) {
  const cachedIsland = await getLoadedServer(islandData.uniqueId);
  if (cachedIsland) {
    throw Error("Island already exists!");
  }

  const island = new Island(islandData);
  const validateErr = island.validateSync();
  if (validateErr) {
    throw Error("Provided island data is not valid!");
  }

  await Island.replaceOne({ uniqueId: island.uniqueId }, island, {
    upsert: true,
  });

  sendCreatePacket(island.uniqueId, server);
}

export async function deleteIsland(id: string): Promise<number> {
  Member.deleteMany({ islandId: id }).exec();
  return (await Island.deleteOne({ uniqueId: id })).deletedCount;
}

export async function saveIsland(islandData: any) {
  await Island.replaceOne({ uniqueId: islandData.uniqueId }, islandData, {
    upsert: true,
  });
}

export async function getAllIslands(): Promise<any> {
  return await Island.find();
}

export async function getIsland(islandId: string) {
  return await Island.findOne({ uniqueId: islandId });
}
