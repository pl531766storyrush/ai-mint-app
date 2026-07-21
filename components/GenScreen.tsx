import { useState, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, radius } from '@/lib/theme';

interface GenScreenProps {
  title: string;
  subtitle: string;
  emoji: string;
  placeholder: string;
  multiline?: boolean;
  generate: (prompt: string) => Promise<string>;
  renderResult: (result: string) => ReactNode;
  suggestions?: string[];
  tool: string;
}

export function GenScreen({
  title,
  subtitle,
  emoji,
  placeholder,
  multiline = true,
  generate,
  renderResult,
  suggestions = [],
  tool,
}: GenScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const out = await generate(prompt);
      setResult(out);
    } catch (e: any) {
      setError(e.message ?? 'Generation failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backBtn}>←</Text>
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerEmoji}>{emoji}</Text>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]} keyboardShouldPersistTaps="handled">
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.inputWrap}>
          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            placeholder={placeholder}
            placeholderTextColor={colors.textSubtle}
            multiline={multiline}
            style={styles.input}
          />
        </View>

        {suggestions.length > 0 && !result && !loading && (
          <View style={styles.suggestions}>
            {suggestions.map((s) => (
              <Pressable key={s} style={styles.suggestion} onPress={() => setPrompt(s)}>
                <Text style={styles.suggestionText}>{s}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Pressable
          onPress={handleGenerate}
          disabled={!prompt.trim() || loading}
          style={({ pressed }) => [styles.genBtn, (!prompt.trim() || loading) && styles.genBtnDisabled, pressed && { opacity: 0.85 }]}
        >
          {loading ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <Text style={styles.genBtnText}>Generate</Text>
          )}
        </Pressable>

        {error && <Text style={styles.error}>{error}</Text>}

        {result && (
          <View style={styles.result}>
            <Text style={styles.resultLabel}>RESULT</Text>
            {renderResult(result)}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backBtn: { fontSize: 26, color: colors.text, fontWeight: '300' },
  headerCenter: { alignItems: 'center' },
  headerEmoji: { fontSize: 22 },
  headerTitle: { ...typography.subheading, color: colors.text, marginTop: 2 },
  scroll: { paddingHorizontal: 20, paddingTop: 8, gap: 14 },
  subtitle: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
  inputWrap: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 4,
  },
  input: {
    color: colors.text,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    padding: 12,
  },
  suggestions: { gap: 8 },
  suggestion: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  suggestionText: { ...typography.caption, color: colors.textMuted },
  genBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genBtnDisabled: { opacity: 0.4 },
  genBtnText: { color: colors.textOnPrimary, fontWeight: '700', fontSize: 16 },
  error: { color: colors.error, fontSize: 14 },
  result: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 16,
    gap: 10,
    minHeight: 160,
  },
  resultLabel: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
