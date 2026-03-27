import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ownerShopRecords } from '@/lib/mock-shops';

const formatMoney = (value: number) =>
  `KES ${value.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;

const formatSyncTime = (value: string) =>
  new Date(value).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });

export default function OwnerShopsTab() {
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.page}>
      <View style={styles.heroCard}>
        <Text style={styles.title}>Shops</Text>
        <Text style={styles.subtitle}>
          Select a shop to view live operations and manage pricing, staff, and status.
        </Text>
      </View>

      <View style={styles.sectionCard}>
        {ownerShopRecords.map(shop => (
          <Pressable
            key={shop.id}
            style={styles.shopCard}
            onPress={() => router.push({ pathname: '../shop/[shopId]', params: { shopId: shop.id } })}>
            <View style={styles.shopHead}>
              <Text style={styles.shopName}>{shop.name}</Text>
              <View style={[styles.statusChip, shop.status === 'Closed' && styles.statusChipClosed]}>
                <Text style={[styles.statusText, shop.status === 'Closed' && styles.statusTextClosed]}>
                  {shop.status}
                </Text>
              </View>
            </View>

            <Text style={styles.shopMeta}>{shop.location}</Text>
            <Text style={styles.shopMeta}>
              Sales {formatMoney(shop.todaySales)} • Debt {formatMoney(shop.debtOutstanding)}
            </Text>
            <Text style={styles.shopMeta}>
              On shift {shop.attendantsOnShift} • Last sync {formatSyncTime(shop.lastSyncedAt)}
            </Text>
            <Text style={styles.openHint}>Tap to manage this shop</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Add New Shop</Text>
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
    borderColor: '#D3E3DA',
    backgroundColor: '#F7FCF9',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 4,
  },
  title: {
    color: '#113725',
    fontSize: 20,
    fontWeight: '800',
  },
  subtitle: {
    color: '#607567',
    fontSize: 12.5,
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
  shopCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    backgroundColor: '#FBFDFC',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 3,
  },
  shopHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  shopName: {
    color: '#173527',
    fontSize: 14,
    fontWeight: '800',
    flexShrink: 1,
  },
  statusChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#C7DFC8',
    backgroundColor: '#E9F5EA',
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusChipClosed: {
    borderColor: '#E6CFCA',
    backgroundColor: '#FAEEEE',
  },
  statusText: {
    color: '#2B7143',
    fontSize: 11.5,
    fontWeight: '700',
  },
  statusTextClosed: {
    color: '#8A2B1E',
  },
  shopMeta: {
    color: '#607567',
    fontSize: 12,
  },
  openHint: {
    marginTop: 2,
    color: '#1F7A4C',
    fontSize: 12,
    fontWeight: '700',
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
