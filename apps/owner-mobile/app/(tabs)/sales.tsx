import { ScrollView, StyleSheet, Text, View } from 'react-native';

const formatMoney = (value: number) =>
  `KES ${value.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;

const byShop = [
  { id: 's1', name: 'Nyeri Road Shop', sales: 94500 },
  { id: 's2', name: 'Karatina Stage Shop', sales: 61200 },
  { id: 's3', name: 'Nakuru Road Shop', sales: 82400 },
  { id: 's4', name: 'Kiambu Corner Shop', sales: 57800 },
];

export default function OwnerSalesTab() {
  const total = byShop.reduce((acc, item) => acc + item.sales, 0);

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.page}>
      <View style={styles.heroCard}>
        <Text style={styles.overline}>Owner Sales</Text>
        <Text style={styles.title}>All Shops Today</Text>
        <Text style={styles.total}>{formatMoney(total)}</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Sales by Shop</Text>
        {byShop.map(item => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.rowLabel}>{item.name}</Text>
            <Text style={styles.rowValue}>{formatMoney(item.sales)}</Text>
          </View>
        ))}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    color: '#214435',
    fontSize: 14,
  },
  rowValue: {
    color: '#1A5D3C',
    fontSize: 14,
    fontWeight: '800',
  },
});
