import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type DebtRecord = {
  id: string;
  customer: string;
  item: string;
  amount: number;
  dueDate: string;
  status: 'Open' | 'Overdue';
};

const debts: DebtRecord[] = [
  { id: 'debt-1', customer: 'M. Wanjiku', item: '13kg Cylinder', amount: 2800, dueDate: '2026-03-27', status: 'Open' },
  { id: 'debt-2', customer: 'K. Otieno', item: 'Petrol', amount: 1500, dueDate: '2026-03-24', status: 'Overdue' },
  { id: 'debt-3', customer: 'A. Kiptoo', item: '6kg Cylinder', amount: 1200, dueDate: '2026-03-29', status: 'Open' },
  { id: 'debt-4', customer: 'Shop Van 04', item: 'Diesel', amount: 3200, dueDate: '2026-03-23', status: 'Overdue' },
];

const formatMoney = (value: number) => `KES ${value.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;

export default function DebtsTab() {
  const openCount = debts.filter(item => item.status === 'Open').length;
  const overdueCount = debts.filter(item => item.status === 'Overdue').length;
  const totalAmount = debts.reduce((acc, item) => acc + item.amount, 0);

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.overline}>Debt Tracker</Text>
        <Text style={styles.title}>Outstanding Balance</Text>
        <Text style={styles.total}>{formatMoney(totalAmount)}</Text>
        <Text style={styles.subtitle}>{openCount} open • {overdueCount} overdue</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Customer Debts (Dummy)</Text>
        {debts.map(item => (
          <View key={item.id} style={styles.entryRow}>
            <View style={styles.entryMain}>
              <Text style={styles.customer}>{item.customer}</Text>
              <Text style={styles.meta}>{item.item} • Due {item.dueDate}</Text>
            </View>
            <View style={styles.entryAside}>
              <Text style={styles.amount}>{formatMoney(item.amount)}</Text>
              <Text style={[styles.status, item.status === 'Overdue' && styles.statusOverdue]}>{item.status}</Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable
        style={styles.button}
        onPress={() => Alert.alert('Coming soon', 'Debt creation and settlement flow will be added next.')}
      >
        <Text style={styles.buttonText}>Add Debt Record</Text>
      </Pressable>
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
    paddingBottom: 24,
    gap: 12,
  },
  heroCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D9E4DB',
    backgroundColor: '#F8FCF9',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  overline: {
    color: '#4D6D5E',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    marginTop: 6,
    color: '#113726',
    fontSize: 21,
    fontWeight: '800',
  },
  total: {
    marginTop: 4,
    color: '#7D4D00',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 4,
    color: '#6B7A71',
    fontSize: 12.5,
    fontWeight: '600',
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
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    backgroundColor: '#FCFDFC',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
  },
  entryMain: {
    flex: 1,
  },
  entryAside: {
    alignItems: 'flex-end',
  },
  customer: {
    color: '#163426',
    fontSize: 14,
    fontWeight: '700',
  },
  meta: {
    marginTop: 2,
    color: '#607567',
    fontSize: 12,
  },
  amount: {
    color: '#173B2A',
    fontSize: 13.5,
    fontWeight: '800',
  },
  status: {
    marginTop: 2,
    color: '#1D6D42',
    fontSize: 11.5,
    fontWeight: '700',
  },
  statusOverdue: {
    color: '#8A2B1E',
  },
  button: {
    borderRadius: 12,
    backgroundColor: '#7D4D00',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
