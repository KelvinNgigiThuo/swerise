import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getOwnerShopById, type ShopEmployee, type ShopProductPrice, type ShopStatus } from '@/lib/mock-shops';

const formatMoney = (value: number) =>
  `KES ${value.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;

const parseNumber = (raw: string) => {
  const cleaned = raw.replace(/,/g, '').trim();
  if (!cleaned) {
    return NaN;
  }
  return Number(cleaned);
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('en-KE', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function ShopManagementScreen() {
  const params = useLocalSearchParams<{ shopId?: string | string[] }>();
  const shopId = Array.isArray(params.shopId) ? params.shopId[0] : params.shopId ?? '';

  const shop = useMemo(() => getOwnerShopById(shopId), [shopId]);

  const [shopStatus, setShopStatus] = useState<ShopStatus>(shop?.status ?? 'Closed');
  const [attendants, setAttendants] = useState<ShopEmployee[]>(shop?.attendants ?? []);
  const [prices, setPrices] = useState<ShopProductPrice[]>(shop?.productPrices ?? []);
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>(
    Object.fromEntries((shop?.productPrices ?? []).map(item => [item.key, String(item.unitPrice)])),
  );

  if (shop === null) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Shop not found</Text>
          <Pressable style={styles.mainButton} onPress={() => router.back()}>
            <Text style={styles.mainButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const attendantsOnShift = attendants.filter(item => item.shiftStatus === 'On Shift').length;

  const toggleShopStatus = () => {
    setShopStatus(current => (current === 'Open' ? 'Closed' : 'Open'));
  };

  const toggleAttendantShift = (employeeId: string) => {
    setAttendants(previous =>
      previous.map(item =>
        item.id === employeeId
          ? {
              ...item,
              shiftStatus: item.shiftStatus === 'On Shift' ? 'Off Shift' : 'On Shift',
            }
          : item,
      ),
    );
  };

  const savePrice = (productKey: string) => {
    const draft = priceDrafts[productKey] ?? '';
    const parsed = parseNumber(draft);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      Alert.alert('Invalid price', 'Enter a valid unit price above 0.');
      return;
    }

    setPrices(previous =>
      previous.map(item => (item.key === productKey ? { ...item, unitPrice: Number(parsed.toFixed(0)) } : item)),
    );
    Alert.alert('Price updated', 'Shop price has been updated locally (dummy mode).');
  };

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Manage Shop</Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroMain}>
              <Text style={styles.shopName}>{shop.name}</Text>
              <Text style={styles.shopLocation}>{shop.location}</Text>
              <Text style={styles.shopSync}>Last sync: {formatDateTime(shop.lastSyncedAt)}</Text>
            </View>
            <View style={[styles.statusChip, shopStatus === 'Closed' && styles.statusChipClosed]}>
              <Text style={[styles.statusText, shopStatus === 'Closed' && styles.statusTextClosed]}>
                {shopStatus}
              </Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Today Sales</Text>
              <Text style={styles.metricValue}>{formatMoney(shop.todaySales)}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Debt</Text>
              <Text style={styles.metricValue}>{formatMoney(shop.debtOutstanding)}</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Transactions</Text>
              <Text style={styles.metricValue}>{shop.transactionsToday}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Owner Actions</Text>
          <View style={styles.actionGrid}>
            <Pressable style={styles.mainButton} onPress={toggleShopStatus}>
              <Text style={styles.mainButtonText}>
                {shopStatus === 'Open' ? 'Close Shop' : 'Reopen Shop'}
              </Text>
            </Pressable>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => Alert.alert('Sync triggered', 'Sync command sent to shop device queue (dummy).')}>
              <Text style={styles.secondaryButtonText}>Request Sync</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Attendant Management</Text>
          <Text style={styles.sectionHint}>On shift now: {attendantsOnShift}</Text>
          {attendants.map(item => (
            <View key={item.id} style={styles.employeeRow}>
              <View style={styles.employeeMain}>
                <Text style={styles.employeeName}>{item.name}</Text>
                <Text style={styles.employeePhone}>{item.phone}</Text>
              </View>
              <Pressable
                style={[styles.shiftChip, item.shiftStatus === 'Off Shift' && styles.shiftChipOff]}
                onPress={() => toggleAttendantShift(item.id)}>
                <Text style={[styles.shiftChipText, item.shiftStatus === 'Off Shift' && styles.shiftChipTextOff]}>
                  {item.shiftStatus}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Pricing Management</Text>
          <Text style={styles.sectionHint}>
            Update unit prices for this shop. Changes affect future sale entries.
          </Text>
          {prices.map(item => (
            <View key={item.key} style={styles.priceRow}>
              <View style={styles.priceMain}>
                <Text style={styles.priceLabel}>{item.label}</Text>
                <Text style={styles.priceMeta}>Current: {formatMoney(item.unitPrice)} / {item.unit}</Text>
              </View>
              <View style={styles.priceEditor}>
                <TextInput
                  value={priceDrafts[item.key] ?? ''}
                  onChangeText={text => setPriceDrafts(previous => ({ ...previous, [item.key]: text }))}
                  keyboardType="decimal-pad"
                  placeholder="Price"
                  placeholderTextColor="#86A092"
                  style={styles.priceInput}
                />
                <Pressable style={styles.priceSaveButton} onPress={() => savePrice(item.key)}>
                  <Text style={styles.priceSaveText}>Save</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Stock Snapshot</Text>
          {shop.stock.map(item => {
            const isLow = item.remaining <= item.reorderAt;
            return (
              <View key={item.key} style={styles.stockRow}>
                <View style={styles.stockMain}>
                  <Text style={styles.stockLabel}>{item.label}</Text>
                  <Text style={styles.stockMeta}>
                    Reorder at {item.reorderAt.toLocaleString('en-KE')} {item.unit}
                  </Text>
                </View>
                <Text style={[styles.stockValue, isLow && styles.stockValueLow]}>
                  {item.remaining.toLocaleString('en-KE')} {item.unit}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {shop.activities.map(item => (
            <View key={item.id} style={styles.activityRow}>
              <View style={styles.activityMain}>
                <Text style={styles.activityText}>{item.message}</Text>
                <Text style={styles.activityMeta}>{item.time}</Text>
              </View>
              {item.amount !== undefined && <Text style={styles.activityAmount}>{formatMoney(item.amount)}</Text>}
            </View>
          ))}
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
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  emptyTitle: {
    color: '#123827',
    fontSize: 18,
    fontWeight: '800',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 26,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    borderRadius: 10,
    backgroundColor: '#E6F1EA',
    borderWidth: 1,
    borderColor: '#D3E3DA',
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#1B4F35',
    fontWeight: '700',
    fontSize: 12,
  },
  headerTitle: {
    color: '#113725',
    fontSize: 22,
    fontWeight: '800',
  },
  heroCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D3E3DA',
    backgroundColor: '#F7FCF9',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  heroMain: {
    flex: 1,
  },
  shopName: {
    color: '#153D2B',
    fontSize: 20,
    fontWeight: '800',
  },
  shopLocation: {
    marginTop: 2,
    color: '#607567',
    fontSize: 13,
  },
  shopSync: {
    marginTop: 3,
    color: '#587264',
    fontSize: 12,
    fontWeight: '600',
  },
  statusChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#C7DFC8',
    backgroundColor: '#E9F5EA',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusChipClosed: {
    borderColor: '#E6CFCA',
    backgroundColor: '#FAEEEE',
  },
  statusText: {
    color: '#2B7143',
    fontSize: 12,
    fontWeight: '700',
  },
  statusTextClosed: {
    color: '#8A2B1E',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  metricCard: {
    width: '31.8%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D3E3DA',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 2,
  },
  metricLabel: {
    color: '#567061',
    fontSize: 10.5,
    fontWeight: '700',
  },
  metricValue: {
    color: '#173F2D',
    fontSize: 14,
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
  sectionHint: {
    color: '#607567',
    fontSize: 12.5,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  mainButton: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#1F7A4C',
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBDBD1',
    backgroundColor: '#F7FCF9',
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#1F7A4C',
    fontSize: 13,
    fontWeight: '800',
  },
  employeeRow: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    backgroundColor: '#FBFDFC',
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  employeeMain: {
    flex: 1,
  },
  employeeName: {
    color: '#173527',
    fontSize: 13.5,
    fontWeight: '700',
  },
  employeePhone: {
    marginTop: 2,
    color: '#607567',
    fontSize: 12,
  },
  shiftChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#C7DFC8',
    backgroundColor: '#E9F5EA',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  shiftChipOff: {
    borderColor: '#D5DAD9',
    backgroundColor: '#F2F4F3',
  },
  shiftChipText: {
    color: '#2B7143',
    fontSize: 11.5,
    fontWeight: '700',
  },
  shiftChipTextOff: {
    color: '#5A6763',
  },
  priceRow: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    backgroundColor: '#FBFDFC',
    paddingHorizontal: 10,
    paddingVertical: 9,
    gap: 6,
  },
  priceMain: {
    gap: 2,
  },
  priceLabel: {
    color: '#173527',
    fontSize: 13.5,
    fontWeight: '700',
  },
  priceMeta: {
    color: '#607567',
    fontSize: 12,
  },
  priceEditor: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#C9DCD0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#143A29',
  },
  priceSaveButton: {
    borderRadius: 9,
    backgroundColor: '#1F7A4C',
    minWidth: 66,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceSaveText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
  },
  stockRow: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    backgroundColor: '#FBFDFC',
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  stockMain: {
    flex: 1,
  },
  stockLabel: {
    color: '#173527',
    fontSize: 13.5,
    fontWeight: '700',
  },
  stockMeta: {
    marginTop: 2,
    color: '#607567',
    fontSize: 12,
  },
  stockValue: {
    color: '#1A5D3C',
    fontSize: 13.5,
    fontWeight: '800',
  },
  stockValueLow: {
    color: '#8A2B1E',
  },
  activityRow: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    backgroundColor: '#FBFDFC',
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  activityMain: {
    flex: 1,
  },
  activityText: {
    color: '#173527',
    fontSize: 13,
    fontWeight: '700',
  },
  activityMeta: {
    marginTop: 2,
    color: '#607567',
    fontSize: 12,
  },
  activityAmount: {
    color: '#1A5D3C',
    fontSize: 13,
    fontWeight: '800',
  },
});
