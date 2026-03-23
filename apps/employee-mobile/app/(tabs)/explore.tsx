import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ShiftToolsTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shift Tools</Text>
      <Text style={styles.subtitle}>Pending entries and reconciliation tools will be added here.</Text>

      <Pressable style={styles.logoutButton} onPress={() => router.replace('/login')}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F7FA',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#0E2336',
    fontSize: 30,
    fontFamily: 'Georgia',
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 8,
    color: '#4F6477',
    fontSize: 15,
  },
  logoutButton: {
    marginTop: 18,
    alignSelf: 'flex-start',
    backgroundColor: '#FFE9EC',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  logoutText: {
    color: '#8A1126',
    fontWeight: '700',
  },
});
