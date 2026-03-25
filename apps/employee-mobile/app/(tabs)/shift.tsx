import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const queueItems = [
  { id: 'queue-1', label: 'Sales entries pending sync', value: '16' },
  { id: 'queue-2', label: 'Debt records pending sync', value: '3' },
  { id: 'queue-3', label: 'Last sync', value: 'Today, 5:42 PM' },
];

const readings = [
  { pump: 'Petrol Pump', opening: 10452.8, current: 10736.1 },
  { pump: 'Diesel Pump', opening: 7852.5, current: 8017.0 },
  { pump: 'Kerosene Pump', opening: 4221.4, current: 4308.7 },
];

export default function ShiftTab() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.overline}>Shift Tools</Text>
        <Text style={styles.title}>Current Shift</Text>
        <Text style={styles.subtitle}>Started at 06:00 AM • Nyeri Road Shop</Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Sync Queue (Dummy)</Text>
        {queueItems.map(item => (
          <View key={item.id} style={styles.rowBetween}>
            <Text style={styles.rowLabel}>{item.label}</Text>
            <Text style={styles.rowValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Pump Readings (Dummy)</Text>
        {readings.map(item => (
          <View key={item.pump} style={styles.readingRow}>
            <Text style={styles.readingName}>{item.pump}</Text>
            <Text style={styles.readingValue}>Opening: {item.opening.toFixed(1)} L</Text>
            <Text style={styles.readingValue}>Current: {item.current.toFixed(1)} L</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          style={[styles.button, styles.syncButton]}
          onPress={() => Alert.alert('Coming soon', 'Offline sync workflow will be added in backend integration.')}
        >
          <Text style={styles.buttonText}>Sync Now</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.endShiftButton]}
          onPress={() => Alert.alert('Coming soon', 'Shift closure flow will be added next.')}
        >
          <Text style={styles.buttonText}>End Shift</Text>
        </Pressable>
      </View>

      <Pressable style={styles.logoutButton} onPress={() => router.replace('/login')}>
        <Text style={styles.logoutText}>Logout</Text>
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
    color: '#456D5C',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    marginTop: 6,
    color: '#113626',
    fontSize: 21,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 4,
    color: '#607466',
    fontSize: 13,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  rowLabel: {
    flex: 1,
    color: '#203E31',
    fontSize: 13,
  },
  rowValue: {
    color: '#123525',
    fontSize: 13,
    fontWeight: '700',
  },
  readingRow: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    backgroundColor: '#FBFDFC',
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  readingName: {
    color: '#173628',
    fontSize: 13.5,
    fontWeight: '700',
  },
  readingValue: {
    marginTop: 2,
    color: '#607567',
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    minHeight: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncButton: {
    backgroundColor: '#1F7A4C',
  },
  endShiftButton: {
    backgroundColor: '#A4551E',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  logoutButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4CFCF',
    backgroundColor: '#FFF1F1',
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#8A1126',
    fontWeight: '700',
  },
});
