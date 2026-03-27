export type ShopStatus = 'Open' | 'Closed';

export type ShopEmployee = {
  id: string;
  name: string;
  phone: string;
  shiftStatus: 'On Shift' | 'Off Shift';
};

export type ShopProductPrice = {
  key: string;
  label: string;
  unit: string;
  unitPrice: number;
};

export type ShopStockItem = {
  key: string;
  label: string;
  remaining: number;
  unit: string;
  reorderAt: number;
};

export type ShopActivity = {
  id: string;
  time: string;
  message: string;
  amount?: number;
};

export type OwnerShopRecord = {
  id: string;
  name: string;
  location: string;
  status: ShopStatus;
  attendantsOnShift: number;
  todaySales: number;
  debtOutstanding: number;
  transactionsToday: number;
  lastSyncedAt: string;
  syncStatus: 'Synced' | 'Pending Upload';
  attendants: ShopEmployee[];
  productPrices: ShopProductPrice[];
  stock: ShopStockItem[];
  activities: ShopActivity[];
};

export const ownerShopRecords: OwnerShopRecord[] = [
  {
    id: 'nyeri-road',
    name: 'Nyeri Road Shop',
    location: 'Nyeri',
    status: 'Open',
    attendantsOnShift: 2,
    todaySales: 94500,
    debtOutstanding: 7300,
    transactionsToday: 119,
    lastSyncedAt: '2026-03-27T09:34:00.000Z',
    syncStatus: 'Synced',
    attendants: [
      { id: 'emp-1', name: 'Faith Njeri', phone: '0712 303 411', shiftStatus: 'On Shift' },
      { id: 'emp-5', name: 'Samuel Kariuki', phone: '0705 101 299', shiftStatus: 'On Shift' },
    ],
    productPrices: [
      { key: 'petrol', label: 'Petrol', unit: 'L', unitPrice: 179 },
      { key: 'diesel', label: 'Diesel', unit: 'L', unitPrice: 168 },
      { key: 'kerosene', label: 'Kerosene', unit: 'L', unitPrice: 147 },
      { key: 'gas-6', label: 'Gas Cylinder 6kg', unit: 'cylinder', unitPrice: 1150 },
      { key: 'gas-13', label: 'Gas Cylinder 13kg', unit: 'cylinder', unitPrice: 2300 },
    ],
    stock: [
      { key: 's1', label: 'Petrol Tank', remaining: 3100, unit: 'L', reorderAt: 600 },
      { key: 's2', label: 'Diesel Tank', remaining: 2200, unit: 'L', reorderAt: 500 },
      { key: 's3', label: 'Kerosene Tank', remaining: 480, unit: 'L', reorderAt: 250 },
      { key: 's4', label: '6kg Cylinders', remaining: 21, unit: 'cylinders', reorderAt: 10 },
      { key: 's5', label: '13kg Cylinders', remaining: 11, unit: 'cylinders', reorderAt: 8 },
    ],
    activities: [
      { id: 'a1', time: '09:10 AM', message: 'Shift opened by Faith Njeri' },
      { id: 'a2', time: '09:55 AM', message: 'Debt sale recorded (13kg cylinder)', amount: 2300 },
      { id: 'a3', time: '10:21 AM', message: 'Diesel sales batch synced', amount: 7900 },
    ],
  },
  {
    id: 'karatina-stage',
    name: 'Karatina Stage Shop',
    location: 'Karatina',
    status: 'Open',
    attendantsOnShift: 1,
    todaySales: 61200,
    debtOutstanding: 4100,
    transactionsToday: 86,
    lastSyncedAt: '2026-03-27T08:58:00.000Z',
    syncStatus: 'Pending Upload',
    attendants: [
      { id: 'emp-2', name: 'Peter Maina', phone: '0701 884 345', shiftStatus: 'On Shift' },
      { id: 'emp-6', name: 'Mercy Wambui', phone: '0718 113 912', shiftStatus: 'Off Shift' },
    ],
    productPrices: [
      { key: 'petrol', label: 'Petrol', unit: 'L', unitPrice: 179 },
      { key: 'diesel', label: 'Diesel', unit: 'L', unitPrice: 168 },
      { key: 'kerosene', label: 'Kerosene', unit: 'L', unitPrice: 147 },
      { key: 'gas-6', label: 'Gas Cylinder 6kg', unit: 'cylinder', unitPrice: 1150 },
      { key: 'gas-13', label: 'Gas Cylinder 13kg', unit: 'cylinder', unitPrice: 2300 },
    ],
    stock: [
      { key: 's1', label: 'Petrol Tank', remaining: 2020, unit: 'L', reorderAt: 600 },
      { key: 's2', label: 'Diesel Tank', remaining: 980, unit: 'L', reorderAt: 500 },
      { key: 's3', label: 'Kerosene Tank', remaining: 260, unit: 'L', reorderAt: 250 },
      { key: 's4', label: '6kg Cylinders', remaining: 12, unit: 'cylinders', reorderAt: 10 },
      { key: 's5', label: '13kg Cylinders', remaining: 6, unit: 'cylinders', reorderAt: 8 },
    ],
    activities: [
      { id: 'a1', time: '08:35 AM', message: 'Shop synced with pending records' },
      { id: 'a2', time: '09:40 AM', message: 'Kerosene stock nearing reorder level' },
      { id: 'a3', time: '10:10 AM', message: 'Cash pickup confirmed', amount: 12000 },
    ],
  },
  {
    id: 'nakuru-road',
    name: 'Nakuru Road Shop',
    location: 'Nakuru',
    status: 'Open',
    attendantsOnShift: 2,
    todaySales: 82400,
    debtOutstanding: 8600,
    transactionsToday: 101,
    lastSyncedAt: '2026-03-27T09:22:00.000Z',
    syncStatus: 'Synced',
    attendants: [
      { id: 'emp-3', name: 'Brian Mwangi', phone: '0711 700 402', shiftStatus: 'On Shift' },
      { id: 'emp-7', name: 'Alice K.', phone: '0722 044 681', shiftStatus: 'On Shift' },
    ],
    productPrices: [
      { key: 'petrol', label: 'Petrol', unit: 'L', unitPrice: 180 },
      { key: 'diesel', label: 'Diesel', unit: 'L', unitPrice: 169 },
      { key: 'kerosene', label: 'Kerosene', unit: 'L', unitPrice: 147 },
      { key: 'gas-6', label: 'Gas Cylinder 6kg', unit: 'cylinder', unitPrice: 1160 },
      { key: 'gas-13', label: 'Gas Cylinder 13kg', unit: 'cylinder', unitPrice: 2320 },
    ],
    stock: [
      { key: 's1', label: 'Petrol Tank', remaining: 2500, unit: 'L', reorderAt: 600 },
      { key: 's2', label: 'Diesel Tank', remaining: 1350, unit: 'L', reorderAt: 500 },
      { key: 's3', label: 'Kerosene Tank', remaining: 410, unit: 'L', reorderAt: 250 },
      { key: 's4', label: '6kg Cylinders', remaining: 17, unit: 'cylinders', reorderAt: 10 },
      { key: 's5', label: '13kg Cylinders', remaining: 9, unit: 'cylinders', reorderAt: 8 },
    ],
    activities: [
      { id: 'a1', time: '09:05 AM', message: 'Debt follow-up reminder generated' },
      { id: 'a2', time: '09:50 AM', message: 'Pump 2 temporary pause resolved' },
      { id: 'a3', time: '10:34 AM', message: 'M-Pesa sales synced', amount: 18400 },
    ],
  },
  {
    id: 'kiambu-corner',
    name: 'Kiambu Corner Shop',
    location: 'Kiambu',
    status: 'Closed',
    attendantsOnShift: 0,
    todaySales: 57800,
    debtOutstanding: 3500,
    transactionsToday: 72,
    lastSyncedAt: '2026-03-26T19:42:00.000Z',
    syncStatus: 'Synced',
    attendants: [
      { id: 'emp-4', name: 'Alice Wambui', phone: '0719 801 174', shiftStatus: 'Off Shift' },
      { id: 'emp-8', name: 'Victor Kimani', phone: '0709 338 517', shiftStatus: 'Off Shift' },
    ],
    productPrices: [
      { key: 'petrol', label: 'Petrol', unit: 'L', unitPrice: 179 },
      { key: 'diesel', label: 'Diesel', unit: 'L', unitPrice: 168 },
      { key: 'kerosene', label: 'Kerosene', unit: 'L', unitPrice: 147 },
      { key: 'gas-6', label: 'Gas Cylinder 6kg', unit: 'cylinder', unitPrice: 1140 },
      { key: 'gas-13', label: 'Gas Cylinder 13kg', unit: 'cylinder', unitPrice: 2290 },
    ],
    stock: [
      { key: 's1', label: 'Petrol Tank', remaining: 1800, unit: 'L', reorderAt: 600 },
      { key: 's2', label: 'Diesel Tank', remaining: 1120, unit: 'L', reorderAt: 500 },
      { key: 's3', label: 'Kerosene Tank', remaining: 220, unit: 'L', reorderAt: 250 },
      { key: 's4', label: '6kg Cylinders', remaining: 8, unit: 'cylinders', reorderAt: 10 },
      { key: 's5', label: '13kg Cylinders', remaining: 5, unit: 'cylinders', reorderAt: 8 },
    ],
    activities: [
      { id: 'a1', time: '06:42 PM', message: 'Shop closed by Alice Wambui' },
      { id: 'a2', time: '06:50 PM', message: 'Final sales sync completed', amount: 9800 },
      { id: 'a3', time: '07:05 PM', message: 'Daily cash handover confirmed' },
    ],
  },
];

export function getOwnerShopById(shopId: string) {
  return ownerShopRecords.find(shop => shop.id === shopId) ?? null;
}
