import NetInfo from "@react-native-community/netinfo";
import { databases, ID } from "./appwrite";
import { APPWRITE_CONFIG, isAppwriteConfigured } from "../config/appwrite";
import { getPendingSyncItems, markSyncFailed, markSyncSuccess } from "../database";

const collectionMap: Record<string, string> = {
  sales: APPWRITE_CONFIG.collections.sales,
  customers: APPWRITE_CONFIG.collections.customers,
  stock_movements: APPWRITE_CONFIG.collections.stockMovements,
  debts: APPWRITE_CONFIG.collections.debts,
  debt_payments: APPWRITE_CONFIG.collections.debtPayments,
  prices: APPWRITE_CONFIG.collections.prices,
  stock_thresholds: APPWRITE_CONFIG.collections.stockThresholds
};

const pushItem = async (item: any) => {
  const payload = JSON.parse(item.payload);
  const collectionId = collectionMap[item.entity_type];
  if (!collectionId) {
    throw new Error(`No collection mapping for ${item.entity_type}`);
  }
  const documentId = payload.client_id || ID.unique();

  if (item.operation === "create") {
    await databases.createDocument(APPWRITE_CONFIG.databaseId, collectionId, documentId, payload);
    return;
  }

  if (item.operation === "update") {
    if (!payload.client_id) {
      throw new Error("Missing client_id for update operation");
    }
    await databases.updateDocument(APPWRITE_CONFIG.databaseId, collectionId, payload.client_id, payload);
    return;
  }

  if (item.operation === "delete") {
    if (!payload.client_id) {
      throw new Error("Missing client_id for delete operation");
    }
    await databases.deleteDocument(APPWRITE_CONFIG.databaseId, collectionId, payload.client_id);
  }
};

export const syncPending = async () => {
  if (!isAppwriteConfigured()) {
    return { synced: 0, skipped: true };
  }

  const items = await getPendingSyncItems(100);
  let synced = 0;

  for (const item of items) {
    try {
      await pushItem(item);
      await markSyncSuccess(item.queue_id);
      synced += 1;
    } catch (error: any) {
      await markSyncFailed(item.queue_id, error?.message || "Unknown sync error");
    }
  }

  return { synced, skipped: false };
};

export const startSyncOnConnectivity = () => {
  return NetInfo.addEventListener(state => {
    if (state.isConnected) {
      syncPending();
    }
  });
};
