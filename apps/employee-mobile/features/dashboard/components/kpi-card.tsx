import { StyleSheet, Text, View } from 'react-native';

type KpiTone = 'green' | 'blue' | 'amber' | 'red';

type KpiCardProps = {
  label: string;
  value: string;
  tone?: KpiTone;
};

const toneStyles: Record<KpiTone, { borderColor: string; valueColor: string; chipColor: string }> = {
  green: { borderColor: '#CAE7D6', valueColor: '#165C39', chipColor: '#E7F5EC' },
  blue: { borderColor: '#CAE0F0', valueColor: '#1B4C75', chipColor: '#E7F2FA' },
  amber: { borderColor: '#EFDDBE', valueColor: '#7B4C00', chipColor: '#FAF0DE' },
  red: { borderColor: '#F0CCCC', valueColor: '#8A1E1E', chipColor: '#FBECEC' },
};

export function KpiCard({ label, value, tone = 'green' }: KpiCardProps) {
  const palette = toneStyles[tone];

  return (
    <View style={[styles.card, { borderColor: palette.borderColor }]}> 
      <View style={[styles.chip, { backgroundColor: palette.chipColor }]}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={[styles.value, { color: palette.valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 11,
    minHeight: 92,
    justifyContent: 'space-between',
  },
  chip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  label: {
    color: '#385949',
    fontSize: 11.5,
    fontWeight: '700',
  },
  value: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '800',
  },
});
