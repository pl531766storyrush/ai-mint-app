import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { GenScreen } from '@/components/GenScreen';
import { generateSearch, saveHistory } from '@/lib/ai';
import { colors, typography } from '@/lib/theme';

const SUGGESTIONS = [
  'What is the capital of Australia?',
  'Latest developments in renewable energy',
  'How does quantum entanglement work?',
  'Best practices for learning a new language',
];

export default function SearchScreen() {
  return (
    <GenScreen
      title="Web Search"
      subtitle="Ask anything and get a concise answer"
      emoji="🌐"
      placeholder="Search the web…"
      suggestions={SUGGESTIONS}
      tool="search"
      generate={async (prompt) => {
        const out = await generateSearch(prompt);
        await saveHistory('search', prompt, out);
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
