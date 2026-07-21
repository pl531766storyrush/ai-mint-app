import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Header } from '@/components/Header';
import { ToolCard } from '@/components/ToolCard';
import { TOOLS } from '@/lib/tools';
import { colors, spacing } from '@/lib/theme';

export default function ToolsScreen() {
  return (
    <View style={styles.container}>
      <Header title="AI Tools" subtitle="Pick a tool to start creating" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {TOOLS.map((tool) => (
            <ToolCard key={tool.key} tool={tool} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
