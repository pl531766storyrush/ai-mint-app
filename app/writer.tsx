import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GenScreen } from '@/components/GenScreen';
import { generateText, saveHistory } from '@/lib/ai';
import { colors, typography, radius } from '@/lib/theme';

const SUGGESTIONS = [
  'Write a blog intro about AI in education',
  'Draft a polite follow-up email to a client',
  'Write a product description for wireless earbuds',
  'Compose a short poem about autumn',
];

export default function WriterScreen() {
  return (
    <GenScreen
      title="AI Writer"
      subtitle="Generate articles, emails, descriptions and more"
      emoji="✍️"
      placeholder="What should I write? Describe the content, tone and length…"
      suggestions={SUGGESTIONS}
      tool="writer"
      generate={async (prompt) => {
        const out = await generateText(prompt, 'content');
        await saveHistory('writer', prompt, out);
        return out;
      }}
      renderResult={(text) => (
        <ScrollView style={styles.textScroll}>
          <Text style={styles.text}>{text}</Text>
        </ScrollView>
      )}
    />
  );
}

const styles = StyleSheet.create({
  textScroll: { maxHeight: 400 },
  text: {
    ...typography.body,
    color: colors.text,
    lineHeight: 24,
  },
});
