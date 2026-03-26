import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { OWNER_PRODUCT_CONFIG, type ProductKey } from '@/lib/owner-pricing';

type SalesByProductRow = {
  productKey: ProductKey;
  quantity: number;
};

type SalesItem = {
  id: string;
  productKey: ProductKey;
  quantity: number;
  payment: 'Cash' | 'Debt' | 'M-Pesa' | 'Mixed';
  time: string;
  mode: 'Single' | 'Peak Batch';
};

const salesByProduct: SalesByProductRow[] = [
  { productKey: 'petrol', quantity: 239.0 },
  { productKey: 'diesel', quantity: 214.0 },
  { productKey: 'kerosene', quantity: 49.9 },
  { productKey: '6kg', quantity: 4 },
  { productKey: '13kg', quantity: 3 },
];

const recentSales: SalesItem[] = [
  { id: 'sale-1', productKey: 'petrol', quantity: 7.2, payment: 'Cash', time: '08:12 AM', mode: 'Single' },
  { id: 'sale-2', productKey: '13kg', quantity: 1, payment: 'Debt', time: '09:05 AM', mode: 'Single' },
  { id: 'sale-3', productKey: 'diesel', quantity: 38.5, payment: 'Mixed', time: '09:44 AM', mode: 'Peak Batch' },
  { id: 'sale-4', productKey: 'kerosene', quantity: 1.6, payment: 'M-Pesa', time: '10:01 AM', mode: 'Single' },
];

const formatMoney = (value: number) =>
  `KES ${value.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;

const formatQuantity = (value: number, unit: 'L' | 'cylinders') => {
  if (unit === 'L') {
    return `${value.toLocaleString('en-KE', { maximumFractionDigits: 1 })} L`;
  }
  return `${value.toLocaleString('en-KE', { maximumFractionDigits: 0 })} cylinders`;
};

export default function SalesTab() {
  const byProductTotals = salesByProduct.map(row => {
    const config = OWNER_PRODUCT_CONFIG[row.productKey];
    const total = row.quantity * config.unitPrice;
    return { ...row, config, total };
  });

  const total = byProductTotals.reduce((acc, row) => acc + row.total, 0);

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.page}>
      <View style={styles.heroCard}>
        <Text style={styles.overline}>Sales Snapshot</Text>
        <Text style={styles.title}>Today&apos;s Sales</Text>
        <Text style={styles.total}>{formatMoney(total)}</Text>
        <Text style={styles.heroMeta}>All totals are auto-calculated from owner-set unit prices.</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Owner Unit Prices</Text>
        {Object.entries(OWNER_PRODUCT_CONFIG).map(([key, config]) => (
          <View key={key} style={styles.priceRow}>
            <Text style={styles.priceName}>{config.label}</Text>
            <Text style={styles.priceValue}>
              {formatMoney(config.unitPrice)} / {config.unitLabel}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>By Product</Text>
        {byProductTotals.map(row => (
          <View key={row.productKey} style={styles.productRow}>
            <View style={styles.productIdentity}>
              <Text style={styles.productName}>{row.config.label}</Text>
              <Text style={styles.productMeta}>
                {formatQuantity(row.quantity, row.config.unitLabel)} • {formatMoney(row.config.unitPrice)} / {row.config.unitLabel}
              </Text>
            </View>
            <Text style={styles.rowValue}>{formatMoney(row.total)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Recent Entries (Dummy)</Text>
        {recentSales.map(item => {
          const config = OWNER_PRODUCT_CONFIG[item.productKey];
          const amount = item.quantity * config.unitPrice;

          return (
            <View key={item.id} style={styles.entryRow}>
              <View style={styles.entryIdentity}>
                <Text style={styles.entryTitle}>{config.label}</Text>
                <Text style={styles.entryMeta}>
                  {item.payment} • {item.time} • {item.mode}
                </Text>
                <Text style={styles.entrySubMeta}>
                  {formatQuantity(item.quantity, config.unitLabel)} × {formatMoney(config.unitPrice)}
                </Text>
              </View>
              <Text style={styles.entryAmount}>{formatMoney(amount)}</Text>
            </View>
          );
        })}
      </View>

      <Pressable style={styles.button} onPress={() => router.push('/sale-entry')}>
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
    gap: 3,
  },
  overline: {
    color: '#48715E',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    marginTop: 3,
    color: '#133927',
    fontSize: 21,
    fontWeight: '800',
  },
  total: {
    color: '#1F7A4C',
    fontSize: 28,
    fontWeight: '800',
  },
  heroMeta: {
    color: '#4E6C5D',
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
  priceRow: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    backgroundColor: '#FBFDFC',
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceName: {
    color: '#173527',
    fontSize: 14,
    fontWeight: '700',
  },
  priceValue: {
    color: '#1A5D3C',
    fontSize: 13,
    fontWeight: '800',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  productIdentity: {
    flex: 1,
  },
  productName: {
    color: '#173527',
    fontSize: 14,
    fontWeight: '700',
  },
  productMeta: {
    marginTop: 2,
    color: '#607567',
    fontSize: 12,
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
    gap: 8,
  },
  entryIdentity: {
    flex: 1,
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
  entrySubMeta: {
    marginTop: 2,
    color: '#557062',
    fontSize: 12,
    fontWeight: '600',
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
