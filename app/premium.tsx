import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { colors, typography, radius } from '@/lib/theme';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 299,
    period: '/month',
    features: ['Unlimited AI Chat', '50 image generations', '20 video generations', 'Priority support'],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 2999,
    period: '/year',
    features: ['Everything in Monthly', 'Unlimited image & video', 'HD generation', 'Early access to new tools', 'Save 15%'],
    popular: true,
  },
];

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile, refreshProfile } = useAuth();
  const [selected, setSelected] = useState('yearly');
  const [loading, setLoading] = useState(false);

  const isPremium = profile?.plan === 'premium';

  async function subscribe() {
    setLoading(true);
    try {
      // Simulated checkout — in production this would integrate RevenueCat or a payment gateway.
      await supabase.from('subscriptions').insert({
        plan: 'premium',
        status: 'active',
        amount_paise: (PLANS.find((p) => p.id === selected)?.price ?? 0) * 100,
        expires_at: selected === 'yearly'
          ? new Date(Date.now() + 365 * 86400000).toISOString()
          : new Date(Date.now() + 30 * 86400000).toISOString(),
      });
      await supabase.from('profiles').update({ plan: 'premium' }).eq('id', profile?.id);
      await refreshProfile();
      Alert.alert('Welcome to Premium!', 'You now have access to all premium features.');
      router.back();
    } catch (e: any) {
      Alert.alert('Subscription failed', e.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function cancel() {
    Alert.alert('Cancel subscription?', 'You will lose premium benefits at the end of your billing period.', [
      { text: 'Keep Premium', style: 'cancel' },
      {
        text: 'Cancel',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('profiles').update({ plan: 'free' }).eq('id', profile?.id);
          await refreshProfile();
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.backBtn}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Premium</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 20 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>✨</Text>
          <Text style={styles.heroTitle}>Unlock AI Mint Premium</Text>
          <Text style={styles.heroSubtitle}>Unlimited generations, HD quality, and priority access to every AI tool.</Text>
        </View>

        {isPremium ? (
          <Card style={styles.activeCard}>
            <Text style={styles.activeBadge}>ACTIVE</Text>
            <Text style={styles.activeText}>You're a Premium member</Text>
            <Text style={styles.activeSubtext}>Enjoy unlimited access to all AI tools.</Text>
            <Pressable onPress={cancel} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel subscription</Text>
            </Pressable>
          </Card>
        ) : (
          <>
            {PLANS.map((plan) => (
              <Pressable
                key={plan.id}
                onPress={() => setSelected(plan.id)}
                style={({ pressed }) => [
                  styles.planCard,
                  selected === plan.id && styles.planCardSelected,
                  pressed && { opacity: 0.9 },
                ]}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>MOST POPULAR</Text>
                  </View>
                )}
                <View style={styles.planHeader}>
                  <View>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.rupee}>₹</Text>
                      <Text style={styles.price}>{plan.price.toLocaleString('en-IN')}</Text>
                      <Text style={styles.period}>{plan.period}</Text>
                    </View>
                  </View>
                  <View style={[styles.radio, selected === plan.id && styles.radioSelected]}>
                    {selected === plan.id && <View style={styles.radioDot} />}
                  </View>
                </View>
                <View style={styles.features}>
                  {plan.features.map((f) => (
                    <View key={f} style={styles.featureRow}>
                      <Text style={styles.check}>✓</Text>
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            ))}

            <Button label={loading ? '' : 'Subscribe Now'} onPress={subscribe} loading={loading} fullWidth size="lg" />
            <Text style={styles.fineprint}>Cancel anytime. Prices in Indian Rupees (INR). GST inclusive.</Text>
          </>
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
  headerTitle: { ...typography.heading, color: colors.text },
  scroll: { paddingHorizontal: 20, gap: 16 },
  hero: { alignItems: 'center', paddingVertical: 20, gap: 6 },
  heroEmoji: { fontSize: 48 },
  heroTitle: { ...typography.title, color: colors.text, textAlign: 'center' },
  heroSubtitle: { ...typography.caption, color: colors.textMuted, textAlign: 'center', paddingHorizontal: 20 },
  planCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 20,
    gap: 16,
  },
  planCardSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: colors.surfaceAlt,
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  popularText: { ...typography.small, color: colors.textOnPrimary, fontWeight: '700', letterSpacing: 0.5 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  planName: { ...typography.subheading, color: colors.text },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
  rupee: { fontSize: 18, color: colors.text, fontWeight: '600' },
  price: { fontSize: 32, color: colors.text, fontWeight: '800' },
  period: { ...typography.caption, color: colors.textMuted, marginLeft: 4 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  features: { gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  check: { color: colors.primary, fontWeight: '700', fontSize: 16 },
  featureText: { ...typography.caption, color: colors.textMuted, flex: 1 },
  fineprint: { ...typography.small, color: colors.textSubtle, textAlign: 'center', marginTop: 4 },
  activeCard: { alignItems: 'center', gap: 8, padding: 24 },
  activeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.pill,
    ...typography.small,
    color: colors.textOnPrimary,
    fontWeight: '700',
    letterSpacing: 1,
  },
  activeText: { ...typography.heading, color: colors.text },
  activeSubtext: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
  cancelBtn: { marginTop: 12, padding: 8 },
  cancelText: { ...typography.caption, color: colors.error, fontWeight: '600' },
});
