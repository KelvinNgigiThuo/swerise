import { StyleSheet, Text, View } from 'react-native';

import type { ActivityItem } from '@/features/dashboard/types';

type ActivityRowProps = {
  item: ActivityItem;
};

const formatMoney = (value: number) => `KES ${value.toLocaleString('en-KE', { maximumFractionDigits: 0 })}`;

export function ActivityRow({ item }: ActivityRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.main}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.meta}>{item.meta}</Text>
      </View>
      <View style={styles.aside}>
        <Text style={styles.amount}>{formatMoney(item.amount)}</Text>
        <Text style={styles.time}>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    backgroundColor: '#FBFDFC',
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  main: {
    flex: 1,
  },
  aside: {
    alignItems: 'flex-end',
  },
  title: {
    color: '#173628',
    fontSize: 13.5,
    fontWeight: '700',
  },
  meta: {
    marginTop: 2,
    color: '#607567',
    fontSize: 12,
  },
  amount: {
    color: '#1A5D3C',
    fontSize: 13,
    fontWeight: '800',
  },
  time: {
    marginTop: 2,
    color: '#607567',
    fontSize: 11.5,
  },
});
