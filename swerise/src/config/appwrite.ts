export const APPWRITE_CONFIG = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "<APPWRITE_PROJECT_ID>",
  platform: "com.swerise",
  databaseId: "<APPWRITE_DATABASE_ID>",
  collections: {
    sales: "<COLLECTION_ID_SALES>",
    customers: "<COLLECTION_ID_CUSTOMERS>",
    stockMovements: "<COLLECTION_ID_STOCK_MOVEMENTS>",
    debts: "<COLLECTION_ID_DEBTS>",
    debtPayments: "<COLLECTION_ID_DEBT_PAYMENTS>",
    prices: "<COLLECTION_ID_PRICES>",
    stockThresholds: "<COLLECTION_ID_STOCK_THRESHOLDS>"
  }
};

const hasPlaceholder = (value: unknown): boolean => {
  if (typeof value === "string") {
    return value.includes("<");
  }
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some(hasPlaceholder);
  }
  return false;
};

export const isAppwriteConfigured = () => !hasPlaceholder(APPWRITE_CONFIG);
