import { router } from 'expo-router';
import { ActivityIndicator, Pressable, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ActivityRow } from '@/features/dashboard/components/activity-row';
import { QuickActionButton } from '@/features/dashboard/components/quick-action-button';
import { useDashboardData } from '@/features/dashboard/hooks/use-dashboard-data';
import type { DashboardAlert, ShiftStatus } from '@/features/dashboard/types';

const shiftStatusLabel: Record<ShiftStatus, string> = {
  active: 'Shift Active',
  ended: 'Shift Ended',
  not_started: 'Shift Not Started',
};

const shiftTone: Record<ShiftStatus, { bg: string; text: string; border: string }> = {
  active: { bg: '#E7F5EC', text: '#1B663F', border: '#C8E5D5' },
  ended: { bg: '#F7F0DE', text: '#7C5A13', border: '#E7D8B7' },
  not_started: { bg: '#F2F3F5', text: '#4E5D68', border: '#D6DCE1' },
};

const alertLevelColor: Record<DashboardAlert['level'], string> = {
  info: '#1C5C8B',
  warning: '#8A5A09',
  critical: '#A31919',
};

const formatUpdatedAt = (value: Date | null) => {
  if (value === null) {
    return '--';
  }

  return value.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCompact = (value: number) =>
  value.toLocaleString('en-KE', {
    maximumFractionDigits: 0,
  });

export default function EmployeeDashboardTab() {
  const { summary, alerts, activities, error, isLoading, isRefreshing, lastUpdated, refresh } = useDashboardData();

  if (isLoading && summary === null) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#1F7A4C" />
          <Text style={styles.stateText}>Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (summary === null) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.centerState}>
          <Text style={styles.stateTitle}>Dashboard unavailable</Text>
          <Text style={styles.stateText}>Unable to fetch dashboard data right now.</Text>
          <Pressable style={styles.retryButton} onPress={() => void refresh()}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const badgeTone = shiftTone[summary.shiftStatus];

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => void refresh()} />}>
        <View style={styles.heroCard}>
          <View style={styles.heroHeaderRow}>
            <View style={styles.heroIdentityBlock}>
              <Text style={styles.identityLabel}>Attendant</Text>
              <Text style={styles.welcomeText}>{summary.employeeName}</Text>
              <Text style={styles.shopText}>{summary.shopName}</Text>
            </View>

            <View style={styles.heroStatusBlock}>
              <View style={[styles.shiftPill, { backgroundColor: badgeTone.bg, borderColor: badgeTone.border }]}>
                <Text style={[styles.shiftPillText, { color: badgeTone.text }]}>{shiftStatusLabel[summary.shiftStatus]}</Text>
              </View>
            </View>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroFooterRow}>
            <View>
              <Text style={styles.syncLabel}>Last synced</Text>
              <Text style={styles.lastSyncText}>{formatUpdatedAt(lastUpdated)}</Text>
            </View>

            <Pressable
              style={({ pressed }) => [styles.syncButton, (pressed || isRefreshing) && styles.syncButtonPressed]}
              onPress={() => void refresh()}
              disabled={isRefreshing}>
              <Text style={styles.syncButtonText}>{isRefreshing ? 'Syncing...' : 'Sync now'}</Text>
            </Pressable>
          </View>
        </View>

        {error !== null && (
          <View style={styles.inlineError}>
            <Text style={styles.inlineErrorText}>{error}</Text>
          </View>
        )}

        <View style={styles.glanceSection}>
          <Text style={styles.sectionTitle}>Today at a glance</Text>

          <View style={styles.glanceRow}>
            <View style={[styles.glanceCard, styles.glanceSalesCard]}>
              <View style={[styles.glanceAccent, styles.glanceSalesAccent]} />
              <Text style={styles.glanceLabel}>Sales</Text>
              <Text style={styles.glanceValue} numberOfLines={1}>
                {'KES ' + formatCompact(summary.todaySales)}
              </Text>
            </View>
            <View style={[styles.glanceCard, styles.glanceTransactionsCard]}>
              <View style={[styles.glanceAccent, styles.glanceTransactionsAccent]} />
              <Text style={styles.glanceLabel}>Transactions</Text>
              <Text style={styles.glanceValue} numberOfLines={1}>
                {formatCompact(summary.transactionCount)}
              </Text>
            </View>
            <View style={[styles.glanceCard, styles.glancePendingCard]}>
              <View style={[styles.glanceAccent, styles.glancePendingAccent]} />
              <Text style={styles.glanceLabel}>Pending</Text>
              <Text style={styles.glanceValue} numberOfLines={1}>
                {formatCompact(summary.pendingActions)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionHint}>
            Pricing is managed by the owner. Record quantity and payment only.
          </Text>
          <View style={styles.actionsGrid}>
            <View style={styles.actionCell}>
              <QuickActionButton
                label="New Sale"
                accent="green"
                onPress={() => router.push('/sale-entry')}
              />
            </View>
            <View style={styles.actionCell}>
              <QuickActionButton label="Shift Tools" accent="blue" onPress={() => router.push('/(tabs)/shift')} />
            </View>
            <View style={styles.actionCell}>
              <QuickActionButton
                label="Manage Debts"
                accent="rose"
                onPress={() => router.push('/(tabs)/debts')}
              />
            </View>
            <View style={styles.actionCell}>
              <QuickActionButton label="Logout" accent="rose" onPress={() => router.replace('/login')} />
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Alerts</Text>
          {alerts.length === 0 ? (
            <Text style={styles.emptyText}>No active alerts.</Text>
          ) : (
            alerts.map(alert => (
              <View key={alert.id} style={[styles.alertRow, { borderLeftColor: alertLevelColor[alert.level] }]}>
                <Text style={styles.alertMessage}>{alert.message}</Text>
                <Text style={styles.alertMeta}>{new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {activities.length === 0 ? (
            <Text style={styles.emptyText}>No transactions yet for this shift.</Text>
          ) : (
            activities.map(item => <ActivityRow key={item.id} item={item} />)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#ECF4EF',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
  heroCard: {
    backgroundColor: '#F7FCF9',
    borderColor: '#D3E4DA',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  heroIdentityBlock: {
    flex: 1,
  },
  heroStatusBlock: {
    alignItems: 'flex-end',
  },
  identityLabel: {
    color: '#557261',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  welcomeText: {
    marginTop: 3,
    color: '#103F2B',
    fontSize: 22,
    fontWeight: '800',
  },
  shopText: {
    marginTop: 3,
    color: '#607466',
    fontSize: 13.5,
    fontWeight: '500',
  },
  shiftPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  shiftPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  heroDivider: {
    marginTop: 12,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D9E8DF',
  },
  heroFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  syncLabel: {
    color: '#607466',
    fontSize: 11.5,
    fontWeight: '600',
  },
  lastSyncText: {
    marginTop: 2,
    color: '#184632',
    fontSize: 13,
    fontWeight: '700',
  },
  syncButton: {
    minHeight: 36,
    borderRadius: 10,
    backgroundColor: '#1F7A4C',
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncButtonPressed: {
    opacity: 0.88,
  },
  syncButtonText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  sectionTitle: {
    color: '#113725',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionHint: {
    marginTop: 1,
    marginBottom: 3,
    color: '#5C7468',
    fontSize: 12,
    fontWeight: '600',
  },
  glanceSection: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D3E3DA',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  glanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: 8,
  },
  glanceCard: {
    width: '32%',
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 92,
    paddingHorizontal: 9,
    paddingVertical: 9,
    justifyContent: 'flex-start',
    gap: 6,
  },
  glanceSalesCard: {
    borderColor: '#CBE8D6',
    backgroundColor: '#F8FCF9',
  },
  glanceTransactionsCard: {
    borderColor: '#C9DFEF',
    backgroundColor: '#F8FBFF',
  },
  glancePendingCard: {
    borderColor: '#EFCFCF',
    backgroundColor: '#FFF9F9',
  },
  glanceLabel: {
    color: '#4F6B5E',
    fontSize: 10.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  glanceValue: {
    color: '#163F2D',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
    marginTop: 'auto',
  },
  glanceAccent: {
    height: 3,
    width: 28,
    borderRadius: 999,
    marginBottom: 6,
  },
  glanceSalesAccent: {
    backgroundColor: '#1F7A4C',
  },
  glanceTransactionsAccent: {
    backgroundColor: '#2E74A8',
  },
  glancePendingAccent: {
    backgroundColor: '#B04343',
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D3E3DA',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  actionCell: {
    width: '50%',
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  alertRow: {
    borderLeftWidth: 4,
    borderRadius: 8,
    borderColor: '#C5D5CD',
    backgroundColor: '#FBFDFC',
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  alertMessage: {
    color: '#18382A',
    fontSize: 13,
    fontWeight: '600',
  },
  alertMeta: {
    marginTop: 4,
    color: '#607365',
    fontSize: 11.5,
  },
  emptyText: {
    color: '#698174',
    fontSize: 13,
  },
  inlineError: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0C8C8',
    backgroundColor: '#FFF2F2',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inlineErrorText: {
    color: '#8F1D1D',
    fontSize: 13,
    fontWeight: '600',
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 8,
  },
  stateTitle: {
    color: '#1D2D24',
    fontSize: 20,
    fontWeight: '700',
  },
  stateText: {
    textAlign: 'center',
    color: '#5D7568',
    fontSize: 14,
  },
  retryButton: {
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: '#1F7A4C',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
