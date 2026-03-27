import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { mockOwners } from '@/lib/mock-owner-auth';

type ShopSnapshot = {
  id: string;
  name: string;
  attendantsOnShift: number;
  todaySales: number;
  debtOutstanding: number;
};

type DashboardAlert = {
  id: string;
  level: 'critical' | 'warning' | 'info';
  message: string;
};

const shopSnapshots: ShopSnapshot[] = [
  {
    id: 'shop-1',
    name: 'Nyeri Road Shop',
    attendantsOnShift: 2,
    todaySales: 94500,
    debtOutstanding: 7300,
  },
  {
    id: 'shop-2',
    name: 'Karatina Stage Shop',
    attendantsOnShift: 1,
    todaySales: 61200,
    debtOutstanding: 4100,
  },
  {
    id: 'shop-3',
    name: 'Nakuru Road Shop',
    attendantsOnShift: 2,
    todaySales: 82400,
    debtOutstanding: 8600,
  },
  {
    id: 'shop-4',
    name: 'Kiambu Corner Shop',
    attendantsOnShift: 1,
    todaySales: 57800,
    debtOutstanding: 3500,
  },
];

const dashboardAlerts: DashboardAlert[] = [
  { id: 'a1', level: 'critical', message: 'Nakuru Road debt balance is above today threshold.' },
  { id: 'a2', level: 'warning', message: 'Karatina Stage has pending debt collections to follow up.' },
  { id: 'a3', level: 'info', message: '3 pricing updates are pending owner approval.' },
];

const formatMoney = (value: number) =>
  `KES ${value.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;

const alertTone: Record<DashboardAlert['level'], { text: string; border: string; bg: string }> = {
  critical: { text: '#962E1E', border: '#F1CCC7', bg: '#FFF6F5' },
  warning: { text: '#875915', border: '#EDDFBF', bg: '#FFFBEF' },
  info: { text: '#1A5B80', border: '#CDE2EF', bg: '#F5FBFF' },
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 17) {
    return 'Good afternoon';
  }
  return 'Good evening';
};

export default function OwnerDashboardTab() {
  const totalSales = shopSnapshots.reduce((acc, shop) => acc + shop.todaySales, 0);
  const totalDebt = shopSnapshots.reduce((acc, shop) => acc + shop.debtOutstanding, 0);
  const activeEmployees = shopSnapshots.reduce((acc, shop) => acc + shop.attendantsOnShift, 0);
  const activeShops = shopSnapshots.filter(shop => shop.attendantsOnShift > 0).length;
  const ownerFirstName = mockOwners[0]?.fullName.split(' ')[0] ?? 'Owner';
  const greeting = getGreeting();
  const kpis = [
    { label: 'Total Debt', value: formatMoney(totalDebt) },
    { label: 'Active Shops', value: `${activeShops}` },
    { label: 'Active Employees', value: `${activeEmployees}` },
  ];

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.page}>
      <View style={styles.heroCard}>
        <View style={[styles.heroGlow, styles.heroGlowOne]} />
        <View style={[styles.heroGlow, styles.heroGlowTwo]} />
        <Text style={styles.greetingText}>{`${greeting}, ${ownerFirstName}.`}</Text>
        <Text style={styles.title}>Business Snapshot</Text>
        <Text style={styles.value}>{formatMoney(totalSales)}</Text>
        <Text style={styles.subtitle}>Combined sales across all shops today</Text>
      </View>

      <View style={styles.kpiGrid}>
        {kpis.map(item => (
          <View key={item.label} style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>{item.label}</Text>
            <Text style={styles.kpiValue} numberOfLines={1}>
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Shop Pulse</Text>
        {shopSnapshots.map(shop => {
          return (
            <View key={shop.id} style={styles.shopCard}>
              <View style={styles.shopHead}>
                <Text style={styles.shopName}>{shop.name}</Text>
                <Text style={styles.shopSales}>{formatMoney(shop.todaySales)}</Text>
              </View>
              <Text style={styles.shopMeta}>
                Debt {formatMoney(shop.debtOutstanding)} • On shift {shop.attendantsOnShift}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Attention Needed</Text>
        {dashboardAlerts.map(item => {
          const tone = alertTone[item.level];
          return (
            <View key={item.id} style={[styles.alertRow, { borderColor: tone.border, backgroundColor: tone.bg }]}>
              <Text style={[styles.alertText, { color: tone.text }]}>{item.message}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Quick Owner Actions</Text>
        <View style={styles.actionGrid}>
          <Pressable style={styles.actionButton} onPress={() => Alert.alert('Coming soon', 'Open new shop flow')}>
            <Text style={styles.actionButtonText}>Open New Shop</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => Alert.alert('Coming soon', 'Pricing control flow')}>
            <Text style={styles.actionButtonText}>Adjust Pricing</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => Alert.alert('Coming soon', 'Employee onboarding flow')}>
            <Text style={styles.actionButtonText}>Add Employee</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => Alert.alert('Coming soon', 'Reports and exports')}>
            <Text style={styles.actionButtonText}>View Reports</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#ECF4EF',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 26,
    gap: 12,
  },
  heroCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D0E2D7',
    backgroundColor: '#F8FCFA',
    paddingHorizontal: 14,
    paddingVertical: 14,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.7,
  },
  heroGlowOne: {
    width: 180,
    height: 180,
    backgroundColor: '#DBF0E3',
    top: -80,
    right: -60,
  },
  heroGlowTwo: {
    width: 130,
    height: 130,
    backgroundColor: '#EAF7EF',
    bottom: -50,
    left: -40,
  },
  overline: {
    color: '#4B6C5B',
    fontSize: 11.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    marginTop: 6,
    color: '#153D2B',
    fontSize: 22,
    fontWeight: '800',
  },
  value: {
    marginTop: 4,
    color: '#1F7A4C',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
    color: '#617668',
    fontSize: 12.5,
    fontWeight: '600',
  },
  greetingText: {
    color: '#1F7A4C',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 2,
  },
  kpiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  kpiCard: {
    width: '31.8%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D3E3DA',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 9,
    paddingVertical: 9,
    gap: 2,
  },
  kpiLabel: {
    color: '#516D5F',
    fontSize: 10.5,
    fontWeight: '700',
  },
  kpiValue: {
    color: '#173F2D',
    fontSize: 16,
    fontWeight: '800',
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
  sectionTitle: {
    color: '#113725',
    fontSize: 16,
    fontWeight: '800',
  },
  shopCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    backgroundColor: '#FBFDFC',
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 5,
  },
  shopHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  shopName: {
    color: '#173527',
    fontSize: 13.5,
    fontWeight: '700',
    flexShrink: 1,
  },
  shopSales: {
    color: '#1A5D3C',
    fontSize: 13.5,
    fontWeight: '800',
  },
  shopMeta: {
    color: '#617668',
    fontSize: 12,
  },
  alertRow: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  alertText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    width: '48.5%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CDE1D5',
    backgroundColor: '#F6FBF8',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#1F7A4C',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
