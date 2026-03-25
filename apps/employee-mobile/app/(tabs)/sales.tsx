import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type SalesItem = {
  id: string;
  product: string;
  amount: number;
  payment: 'Cash' | 'Debt' | 'M-Pesa';
  time: string;
};

const salesByProduct = [
  { label: 'Petrol', value: 42780 },
  { label: 'Diesel', value: 35940 },
  { label: 'Kerosene', value: 7340 },
  { label: 'Gas Cylinders', value: 12600 },
];

const recentSales: SalesItem[] = [
  { id: 'sale-1', product: 'Petrol', amount: 1200, payment: 'Cash', time: '08:12 AM' },
  { id: 'sale-2', product: '13kg Cylinder', amount: 2800, payment: 'Debt', time: '09:05 AM' },
  { id: 'sale-3', product: 'Diesel', amount: 950, payment: 'M-Pesa', time: '09:44 AM' },
  { id: 'sale-4', product: 'Kerosene', amount: 240, payment: 'Cash', time: '10:01 AM' },
];

const formatMoney = (value: number) => `KES ${value.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;

export default function SalesTab() {
  const total = salesByProduct.reduce((acc, item) => acc + item.value, 0);

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.page}>
      <View style={styles.heroCard}>
        <Text style={styles.overline}>Sales Snapshot</Text>
        <Text style={styles.title}>Today&apos;s Sales</Text>
        <Text style={styles.total}>{formatMoney(total)}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>By Product</Text>
        {salesByProduct.map(item => (
          <View key={item.label} style={styles.rowBetween}>
            <Text style={styles.rowLabel}>{item.label}</Text>
            <Text style={styles.rowValue}>{formatMoney(item.value)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Recent Entries (Dummy)</Text>
        {recentSales.map(item => (
          <View key={item.id} style={styles.entryRow}>
            <View>
              <Text style={styles.entryTitle}>{item.product}</Text>
              <Text style={styles.entryMeta}>{item.payment} • {item.time}</Text>
            </View>
            <Text style={styles.entryAmount}>{formatMoney(item.amount)}</Text>
          </View>
        ))}
      </View>

      <Pressable
        style={styles.button}
        onPress={() => Alert.alert('Coming soon', 'Sales capture form will be connected in the next step.')}
      >
        <Text style={styles.buttonText}>Record Sale</Text>
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
    borderColor: '#D3E4DA',
    backgroundColor: '#F7FCF9',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  overline: {
    color: '#48715E',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    marginTop: 6,
    color: '#133927',
    fontSize: 21,
    fontWeight: '800',
  },
  total: {
    marginTop: 4,
    color: '#1F7A4C',
    fontSize: 28,
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    color: '#214435',
    fontSize: 14,
  },
  rowValue: {
    color: '#0F3223',
    fontSize: 14,
    fontWeight: '700',
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    backgroundColor: '#FBFDFC',
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  entryTitle: {
    color: '#173527',
    fontSize: 14,
    fontWeight: '700',
  },
  entryMeta: {
    marginTop: 2,
    color: '#607567',
    fontSize: 12,
  },
  entryAmount: {
    color: '#1A5D3C',
    fontSize: 14,
    fontWeight: '800',
  },
  button: {
    borderRadius: 12,
    backgroundColor: '#1F7A4C',
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
