import { useCallback, useEffect, useMemo, useState } from 'react';

import type { DashboardPayload } from '@/features/dashboard/types';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const DUMMY_PAYLOAD: DashboardPayload = {
  summary: {
    employeeName: 'Attendant Kelvin',
    shopName: 'Nyeri Road Shop',
    shiftStatus: 'active',
    todaySales: 98650,
    transactionCount: 142,
    averageBasket: 694,
    pendingActions: 4,
  },
  alerts: [
    {
      id: 'alert-1',
      level: 'warning',
      message: 'Diesel stock is approaching reorder threshold.',
      createdAt: '2026-03-25T07:15:00.000Z',
    },
    {
      id: 'alert-2',
      level: 'info',
      message: '3 debt payments are due for follow-up today.',
      createdAt: '2026-03-25T08:20:00.000Z',
    },
  ],
  activities: [
    {
      id: 'activity-1',
      title: 'Petrol sale recorded',
      meta: 'Cash • Pump 1',
      amount: 1300,
      createdAt: '2026-03-25T08:12:00.000Z',
    },
    {
      id: 'activity-2',
      title: '13kg cylinder sold on debt',
      meta: 'Customer: M. Wanjiku',
      amount: 2800,
      createdAt: '2026-03-25T09:05:00.000Z',
    },
    {
      id: 'activity-3',
      title: 'Diesel sale recorded',
      meta: 'M-Pesa • Pump 2',
      amount: 950,
      createdAt: '2026-03-25T09:44:00.000Z',
    },
  ],
};

async function fetchDashboardData(): Promise<DashboardPayload> {
  await wait(500);
  return DUMMY_PAYLOAD;
}

export function useDashboardData() {
  const [summary, setSummary] = useState<DashboardPayload['summary'] | null>(null);
  const [alerts, setAlerts] = useState<DashboardPayload['alerts']>([]);
  const [activities, setActivities] = useState<DashboardPayload['activities']>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async (refreshing: boolean) => {
    if (refreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const data = await fetchDashboardData();
      setSummary(data.summary);
      setAlerts(data.alerts);
      setActivities(data.activities);
      setError(null);
      setLastUpdated(new Date());
    } catch {
      setError('Unable to fetch dashboard data right now.');
    } finally {
      if (refreshing) {
        setIsRefreshing(false);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void load(false);
  }, [load]);

  const refresh = useCallback(async () => {
    await load(true);
  }, [load]);

  return useMemo(
    () => ({
      summary,
      alerts,
      activities,
      error,
      isLoading,
      isRefreshing,
      lastUpdated,
      refresh,
    }),
    [summary, alerts, activities, error, isLoading, isRefreshing, lastUpdated, refresh],
  );
}
