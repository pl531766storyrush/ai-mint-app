import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Pressable, Alert } from 'react-native';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Loading } from '@/components/Loading';
import { Empty } from '@/components/Empty';
import { fetchHistory, clearHistory, deleteHistoryItem } from '@/lib/ai';
import { colors, typography, radius } from '@/lib/theme';
import { HistoryItem, ToolType } from '@/types';

const TOOL_EMOJI: Record<ToolType, string> = {
  chat: '💬',
  image: '🎨',
  video: '🎬',
  voice: '🎙️',
  writer: '✍️',
  search: '🌐',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function HistoryScreen() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchHistory();
      setItems(data);
    } catch (e: any) {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleClear() {
    Alert.alert('Clear history?', 'This will permanently delete all your history.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearHistory();
          setItems([]);
        },
      },
    ]);
  }

  async function handleDelete(id: string) {
    await deleteHistoryItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  if (loading) return <Loading label="Loading history…" />;

  return (
    <View style={styles.container}>
      <Header
        title="History"
        subtitle={`${items.length} ${items.length === 1 ? 'item' : 'items'}`}
        right={
          items.length > 0 ? (
            <Pressable onPress={handleClear} hitSlop={12}>
              <Text style={styles.clearBtn}>Clear</Text>
            </Pressable>
          ) : null
        }
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 10, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={colors.primary} />}
        ListEmptyComponent={<Empty title="No history yet" subtitle="Your AI generations will appear here." />}
        renderItem={({ item }) => (
          <Card style={styles.item}>
            <View style={styles.itemHeader}>
              <View style={styles.toolBadge}>
                <Text style={styles.toolEmoji}>{TOOL_EMOJI[item.tool] ?? '✨'}</Text>
                <Text style={styles.toolName}>{item.tool.toUpperCase()}</Text>
              </View>
              <Text style={styles.time}>{timeAgo(item.created_at)}</Text>
            </View>
            {item.prompt ? <Text style={styles.prompt} numberOfLines={2}>{item.prompt}</Text> : null}
            <Text style={styles.result} numberOfLines={3}>{item.result}</Text>
            <Pressable onPress={() => handleDelete(item.id)} hitSlop={12} style={styles.deleteBtn}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  clearBtn: { ...typography.caption, color: colors.error, fontWeight: '600' },
  item: { padding: 14, gap: 8 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toolBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  toolEmoji: { fontSize: 14 },
  toolName: { ...typography.small, color: colors.primary, fontWeight: '700', letterSpacing: 0.5 },
  time: { ...typography.small, color: colors.textSubtle },
  prompt: { ...typography.caption, color: colors.textMuted, fontStyle: 'italic' },
  result: { ...typography.body, color: colors.text },
  deleteBtn: { alignSelf: 'flex-start', marginTop: 4 },
  deleteText: { ...typography.small, color: colors.error },
});
