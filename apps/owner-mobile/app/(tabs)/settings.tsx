import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const options = [
  'Shop management',
  'Product and pricing control',
  'Employee account management',
  'Report export and audit logs',
];

export default function OwnerSettingsTab() {
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.page}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Owner Controls</Text>
        <Text style={styles.helperText}>
          Central place for business setup, permissions, and operational settings.
        </Text>
      </View>

      <View style={styles.sectionCard}>
        {options.map(item => (
          <View key={item} style={styles.row}>
            <Text style={styles.rowLabel}>{item}</Text>
          </View>
        ))}
      </View>

      <Pressable style={styles.logoutButton} onPress={() => router.replace('../login')}>
        <Text style={styles.logoutButtonText}>Logout Owner</Text>
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
  helperText: {
    color: '#607567',
    fontSize: 12.5,
  },
  row: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    backgroundColor: '#FBFDFC',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  rowLabel: {
    color: '#214435',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    borderRadius: 12,
    backgroundColor: '#8A2B1E',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
