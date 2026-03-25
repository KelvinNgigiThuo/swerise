export type ShiftStatus = 'active' | 'ended' | 'not_started';

export type DashboardSummary = {
  employeeName: string;
  shopName: string;
  shiftStatus: ShiftStatus;
  todaySales: number;
  transactionCount: number;
  averageBasket: number;
  pendingActions: number;
};

export type DashboardAlert = {
  id: string;
  level: 'info' | 'warning' | 'critical';
  message: string;
  createdAt: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  meta: string;
  amount: number;
  createdAt: string;
};

export type DashboardPayload = {
  summary: DashboardSummary;
  alerts: DashboardAlert[];
  activities: ActivityItem[];
};
