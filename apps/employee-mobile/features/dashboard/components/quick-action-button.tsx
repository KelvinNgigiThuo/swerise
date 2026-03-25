import { Pressable, StyleSheet, Text } from 'react-native';

type QuickActionAccent = 'green' | 'blue' | 'rose';

type QuickActionButtonProps = {
  label: string;
  accent?: QuickActionAccent;
  onPress: () => void;
};

const accents: Record<QuickActionAccent, { backgroundColor: string; textColor: string }> = {
  green: { backgroundColor: '#E8F5EC', textColor: '#1A5E3B' },
  blue: { backgroundColor: '#E7F0FA', textColor: '#1F4C7A' },
  rose: { backgroundColor: '#FCEDEE', textColor: '#8A2031' },
};

export function QuickActionButton({ label, accent = 'green', onPress }: QuickActionButtonProps) {
  const palette = accents[accent];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.backgroundColor },
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}>
      <Text style={[styles.text, { color: palette.textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    minHeight: 52,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D5E5DC',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
});
