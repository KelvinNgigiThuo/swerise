export type SaleCategory = 'fuel' | 'gas';
export type FuelProduct = 'petrol' | 'diesel' | 'kerosene';
export type GasProduct = '6kg' | '13kg';
export type ProductKey = FuelProduct | GasProduct;

export type ProductPricingConfig = {
  label: string;
  category: SaleCategory;
  unitLabel: 'L' | 'cylinders';
  unitPrice: number;
  accountingAccount: string;
  inventoryBucket: string;
  reorderLevel: number;
};

export const FUEL_OPTIONS: { value: FuelProduct; label: string }[] = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'kerosene', label: 'Kerosene' },
];

export const GAS_OPTIONS: { value: GasProduct; label: string }[] = [
  { value: '6kg', label: '6kg Cylinder' },
  { value: '13kg', label: '13kg Cylinder' },
];

export const OWNER_PRODUCT_CONFIG: Record<ProductKey, ProductPricingConfig> = {
  petrol: {
    label: 'Petrol',
    category: 'fuel',
    unitLabel: 'L',
    unitPrice: 179,
    accountingAccount: 'Fuel Sales - Petrol',
    inventoryBucket: 'Petrol Tank Stock',
    reorderLevel: 600,
  },
  diesel: {
    label: 'Diesel',
    category: 'fuel',
    unitLabel: 'L',
    unitPrice: 168,
    accountingAccount: 'Fuel Sales - Diesel',
    inventoryBucket: 'Diesel Tank Stock',
    reorderLevel: 500,
  },
  kerosene: {
    label: 'Kerosene',
    category: 'fuel',
    unitLabel: 'L',
    unitPrice: 147,
    accountingAccount: 'Fuel Sales - Kerosene',
    inventoryBucket: 'Kerosene Tank Stock',
    reorderLevel: 250,
  },
  '6kg': {
    label: '6kg Cylinder',
    category: 'gas',
    unitLabel: 'cylinders',
    unitPrice: 1150,
    accountingAccount: 'Gas Sales - 6kg',
    inventoryBucket: '6kg Cylinder Stock',
    reorderLevel: 10,
  },
  '13kg': {
    label: '13kg Cylinder',
    category: 'gas',
    unitLabel: 'cylinders',
    unitPrice: 2300,
    accountingAccount: 'Gas Sales - 13kg',
    inventoryBucket: '13kg Cylinder Stock',
    reorderLevel: 8,
  },
};
