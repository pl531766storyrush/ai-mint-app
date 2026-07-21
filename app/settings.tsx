import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth';
import { colors, typography, radius } from '@/lib/theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [haptics, setHaptics] = useState(false);
  const [hd, setHd] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backBtn}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <Card style={styles.section}>
          <ToggleRow label="Push notifications" value={notifications} onChange={setNotifications} />
          <Divider />
          <ToggleRow label="Auto-save history" value={autoSave} onChange={setAutoSave} />
          <Divider />
          <ToggleRow label="Haptic feedback" value={haptics} onChange={setHaptics} />
          <Divider />
          <ToggleRow label="HD generation" value={hd} onChange={setHd} />
        </Card>

        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <Card style={styles.section}>
          <LinkRow label="Change password" onPress={() => {}} />
          <Divider />
          <LinkRow label="Export my data" onPress={() => {}} />
          <Divider />
          <LinkRow label="Delete account" danger onPress={() => {}} />
        </Card>

        <Text style={styles.sectionLabel}>ABOUT</Text>
        <Card style={styles.section}>
          <LinkRow label="App version" value="1.0.0" onPress={() => {}} />
          <Divider />
          <LinkRow label="Privacy Policy" onPress={() => {}} />
          <Divider />
          <LinkRow label="Terms of Service" onPress={() => {}} />
        </Card>

        <Button label="Sign Out" onPress={signOut} variant="danger" fullWidth />
      </ScrollView>
    </View>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.surfaceHover, true: colors.primary }}
        thumbColor="#fff"
      />
    </View>
  );
}

function LinkRow({ label, value, onPress, danger }: { label: string; value?: string; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}>
      <Text style={[styles.rowLabel, danger && { color: colors.error }]}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
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
  headerTitle: { ...typography.heading, color: colors.text },
  scroll: { paddingHorizontal: 20, gap: 16 },
  sectionLabel: { ...typography.small, color: colors.textSubtle, fontWeight: '700', letterSpacing: 1, marginLeft: 4, marginTop: 8 },
  section: { padding: 4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowLabel: { ...typography.body, color: colors.text },
  rowValue: { ...typography.caption, color: colors.textMuted },
  chevron: { fontSize: 22, color: colors.textSubtle, fontWeight: '300' },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 16 },
});
