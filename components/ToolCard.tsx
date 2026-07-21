import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius, typography } from '@/lib/theme';
import { ToolDef } from '@/types';

const ICONS: Record<string, string> = {
  MessageCircle: '💬',
  Image: '🎨',
  Video: '🎬',
  AudioLines: '🎙️',
  PenLine: '✍️',
  Globe: '🌐',
};

export function ToolCard({ tool }: { tool: ToolDef }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(tool.route as any)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, { backgroundColor: tool.accent + '22' }]}>
        <Text style={styles.icon}>{ICONS[tool.icon] ?? '✨'}</Text>
      </View>
      <Text style={styles.title}>{tool.title}</Text>
      <Text style={styles.desc} numberOfLines={2}>{tool.description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    minHeight: 140,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 22,
  },
  title: {
    ...typography.subheading,
    color: colors.text,
    marginBottom: 4,
  },
  desc: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
