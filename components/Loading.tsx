import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';
import { colors, typography } from '@/lib/theme';

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 40,
  },
  text: {
    ...typography.body,
    color: colors.textMuted,
  },
});
