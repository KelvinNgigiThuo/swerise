import { StyleSheet, Text, View } from 'react-native';

type KpiTone = 'green' | 'blue' | 'amber' | 'red';

type KpiCardProps = {
  label: string;
  value: string;
  tone?: KpiTone;
};

type TonePalette = {
  border: string;
  background: string;
  accent: string;
  label: string;
  value: string;
};

const toneStyles: Record<KpiTone, TonePalette> = {
  green: {
    border: '#CBE8D6',
    background: '#F7FCF9',
    accent: '#1F7A4C',
    label: '#2F5D47',
    value: '#124F31',
  },
  blue: {
    border: '#C9DFEF',
    background: '#F7FBFF',
    accent: '#2E74A8',
    label: '#2F5A7C',
    value: '#1B4C75',
  },
  amber: {
    border: '#EEDBB8',
    background: '#FFFCF5',
    accent: '#A06B0E',
    label: '#6F561E',
    value: '#7B4C00',
  },
  red: {
    border: '#EFCFCF',
    background: '#FFF9F9',
    accent: '#B04343',
    label: '#6A3A3A',
    value: '#8A1E1E',
  },
};

export function KpiCard({ label, value, tone = 'green' }: KpiCardProps) {
  const palette = toneStyles[tone];

  return (
    <View style={[styles.card, { borderColor: palette.border, backgroundColor: palette.background }]}>
      <View style={[styles.accent, { backgroundColor: palette.accent }]} />
      <View style={styles.content}>
        <Text style={[styles.label, { color: palette.label }]} numberOfLines={1}>
          {label}
        </Text>
        <Text style={[styles.value, { color: palette.value }]} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 98,
    overflow: 'hidden',
  },
  accent: {
    height: 4,
    width: '100%',
  },
  content: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 6,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  value: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '800',
    flexShrink: 1,
  },
});
