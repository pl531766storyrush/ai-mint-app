import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { ToolCard } from '@/components/ToolCard';
import { Avatar } from '@/components/Avatar';
import { useAuth } from '@/lib/auth';
import { TOOLS } from '@/lib/tools';
import { colors, typography, radius, spacing } from '@/lib/theme';
import { supabase } from '@/lib/supabase';
import { HistoryItem } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuth();
  const [recent, setRecent] = useState<HistoryItem[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      setRecent((data ?? []) as HistoryItem[]);
      const { count: c } = await supabase
        .from('history')
        .select('*', { count: 'exact', head: true });
      setCount(c ?? 0);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title={`Hi, ${profile?.display_name?.split(' ')[0] ?? 'there'}`}
        subtitle="What will you create today?"
        right={<Avatar name={profile?.display_name ?? 'User'} url={profile?.avatar_url} size={44} />}
      />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Card style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>AI MINT PREMIUM</Text>
          </View>
          <Text style={styles.heroTitle}>Unleash your creativity</Text>
          <Text style={styles.heroSubtitle}>Generate images, videos, voice, text and more — all in one place.</Text>
          <Pressable onPress={() => router.push('/premium' as any)} style={styles.heroBtn}>
            <Text style={styles.heroBtnText}>Go Premium</Text>
          </Pressable>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Tools</Text>
          <Text style={styles.sectionAction} onPress={() => router.push('/(tabs)/tools')}>See all</Text>
        </View>
        <View style={styles.grid}>
          {TOOLS.map((tool) => (
            <ToolCard key={tool.key} tool={tool} />
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          <Text style={styles.sectionAction} onPress={() => router.push('/(tabs)/history')}>View all</Text>
        </View>
        {recent.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>No activity yet. Try an AI tool to get started!</Text>
          </Card>
        ) : (
          <View style={styles.recentList}>
            {recent.map((item) => (
              <Card key={item.id} style={styles.recentItem}>
                <View style={styles.recentRow}>
                  <View style={styles.recentDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recentTool}>{item.tool.toUpperCase()}</Text>
                    <Text style={styles.recentPrompt} numberOfLines={1}>{item.prompt || item.result.slice(0, 60)}</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        <Card style={styles.statCard}>
          <Text style={styles.statValue}>{count}</Text>
          <Text style={styles.statLabel}>Total generations</Text>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  hero: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
    borderWidth: 1,
    padding: 20,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginBottom: 12,
  },
  heroBadgeText: {
    ...typography.small,
    color: colors.textOnPrimary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroTitle: {
    ...typography.heading,
    color: colors.text,
    fontSize: 22,
  },
  heroSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 16,
  },
  heroBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.md,
    alignSelf: 'flex-start',
  },
  heroBtnText: {
    color: colors.textOnPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.text,
  },
  sectionAction: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  recentList: { gap: 8 },
  recentItem: { padding: 14 },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  recentTool: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  recentPrompt: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    padding: 8,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    backgroundColor: colors.surfaceAlt,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
