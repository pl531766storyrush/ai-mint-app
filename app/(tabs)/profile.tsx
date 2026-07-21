import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth';
import { colors, typography, radius } from '@/lib/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Header title="Profile" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Avatar name={profile?.display_name ?? 'User'} url={profile?.avatar_url} size={80} />
          <Text style={styles.name}>{profile?.display_name ?? 'User'}</Text>
          <Text style={styles.email}>{profile?.email ?? ''}</Text>
          <View style={[styles.planBadge, profile?.plan === 'premium' && styles.planBadgePremium]}>
            <Text style={[styles.planText, profile?.plan === 'premium' && styles.planTextPremium]}>
              {profile?.plan === 'premium' ? 'PREMIUM' : 'FREE PLAN'}
            </Text>
          </View>
        </View>

        <Card style={styles.section}>
          <Row label="Edit Profile" onPress={() => {}} />
          <Divider />
          <Row label="Settings" onPress={() => router.push('/settings' as any)} />
          <Divider />
          <Row label="Subscription" onPress={() => router.push('/premium' as any)} />
          <Divider />
          <Row label="History" onPress={() => router.push('/(tabs)/history')} />
        </Card>

        <Card style={styles.section}>
          <Row label="Help & Support" onPress={() => {}} />
          <Divider />
          <Row label="Privacy Policy" onPress={() => {}} />
          <Divider />
          <Row label="Terms of Service" onPress={() => {}} />
        </Card>

        <Button label="Sign Out" onPress={signOut} variant="danger" fullWidth />
        <Text style={styles.version}>AI Mint v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

function Row({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  profileHeader: { alignItems: 'center', paddingVertical: 20, gap: 6 },
  name: { ...typography.heading, color: colors.text, fontSize: 22 },
  email: { ...typography.caption, color: colors.textMuted },
  planBadge: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginTop: 6,
  },
  planBadgePremium: { backgroundColor: colors.primary },
  planText: { ...typography.small, color: colors.textMuted, fontWeight: '700', letterSpacing: 1 },
  planTextPremium: { color: colors.textOnPrimary },
  section: { padding: 4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowLabel: { ...typography.body, color: colors.text },
  chevron: { fontSize: 22, color: colors.textSubtle, fontWeight: '300' },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 16 },
  version: { ...typography.small, color: colors.textSubtle, textAlign: 'center', marginTop: 8 },
});
