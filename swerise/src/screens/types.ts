export interface Sale {
  sale_id: number;
  client_id: string;
  shop_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  sale_date: string;
  employee_id: number | null;
  sale_type: "cash" | "debt";
  customer_id: number | null;
  sync_status: number;
  product_name?: string | null;
  product_unit?: string | null;
  customer_name?: string | null;
}

export interface SaleUI {
  id: string;
  date: string;
  customer: string;
  product: string;
  qty: string;
  totalAmount: string;
}

export interface SaleInput {
  shop_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  employee_id: number | null;
}

export interface Debt {
  sale_id: number;
  customer_id: number;
  amount_due: number;
  amount_paid: number;
}

export interface DebtInfo {
  customer_name: string;
  customer_phone: string;
  amount_due: number;
}

export interface ProductWithPrice {
  product_id: number;
  name: string;
  category: string;
  unit: string;
  price: number;
}

export interface StockBalance {
  product_id: number;
  name: string;
  unit: string;
  balance: number;
}

export interface StockThreshold {
  product_id: number;
  name: string;
  unit: string;
  threshold_quantity: number;
}

export interface SyncQueueItem {
  queue_id: number;
  entity_type: string;
  operation: "create" | "update" | "delete";
  payload: string;
  attempt_count: number;
}
