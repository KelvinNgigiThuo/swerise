import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type EmployeeRecord = {
  id: string;
  name: string;
  shop: string;
  status: 'On Shift' | 'Off Shift';
};

const employees: EmployeeRecord[] = [
  { id: 'emp-1', name: 'Faith Njeri', shop: 'Nyeri Road Shop', status: 'On Shift' },
  { id: 'emp-2', name: 'Peter Maina', shop: 'Karatina Stage Shop', status: 'On Shift' },
  { id: 'emp-3', name: 'Brian Mwangi', shop: 'Nakuru Road Shop', status: 'Off Shift' },
  { id: 'emp-4', name: 'Alice Wambui', shop: 'Kiambu Corner Shop', status: 'Off Shift' },
];

export default function OwnerEmployeesTab() {
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.page}>
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Employees</Text>
        <Text style={styles.helperText}>
          Create accounts, assign staff to shops, and review shift coverage.
        </Text>
      </View>

      <View style={styles.sectionCard}>
        {employees.map(item => (
          <View key={item.id} style={styles.row}>
            <View style={styles.rowMain}>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Text style={styles.rowMeta}>{item.shop}</Text>
            </View>
            <View style={[styles.badge, item.status === 'Off Shift' && styles.badgeMuted]}>
              <Text style={[styles.badgeText, item.status === 'Off Shift' && styles.badgeTextMuted]}>
                {item.status}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Add Employee</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2ECE6',
    backgroundColor: '#FBFDFC',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 8,
  },
  rowMain: {
    flex: 1,
  },
  rowTitle: {
    color: '#173527',
    fontSize: 14,
    fontWeight: '700',
  },
  rowMeta: {
    marginTop: 2,
    color: '#607567',
    fontSize: 12,
  },
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#C7DFC8',
    backgroundColor: '#E9F5EA',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeMuted: {
    borderColor: '#D5DAD9',
    backgroundColor: '#F2F4F3',
  },
  badgeText: {
    color: '#2B7143',
    fontSize: 12,
    fontWeight: '700',
  },
  badgeTextMuted: {
    color: '#5A6763',
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
