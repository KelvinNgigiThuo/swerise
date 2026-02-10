export interface Sale {
  sale_id: number; 
  shop_id: number; 
  product_id: number;  
  quantity: number; 
  total_price: number; 
  sale_date: string; 
  employee_id: number | null; 
  sale_type: 'cash' | 'debt'; 
  sync_status: number; 
  customer: string | null; 
}

export interface SaleUI {
  id: string;
  date: string;
  customer: string;
  product: string;
  qty: string;
  totalAmount: string;
}
  
export interface Debt {
  sale_id: number; 
  customer_name: string;
  customer_phone: string | null;
  amount_due: number;
  amount_paid: number; 
}
 

export interface DebtInfo {
  customer_name: string;
  customer_phone: string | null;
  amount_due: number;
}