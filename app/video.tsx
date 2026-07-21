import { View, Text, StyleSheet } from 'react-native';
import { GenScreen } from '@/components/GenScreen';
import { generateVideo, saveHistory } from '@/lib/ai';
import { colors, typography, radius } from '@/lib/theme';

const SUGGESTIONS = [
  'A rocket launching into space',
  'Waves crashing on a rocky shore',
  'Time-lapse of a flower blooming',
];

export default function VideoScreen() {
  return (
    <GenScreen
      title="Video Generator"
      subtitle="Describe a scene to generate a short video clip"
      emoji="🎬"
      placeholder="A cinematic shot of…"
      suggestions={SUGGESTIONS}
      tool="video"
      generate={async (prompt) => {
        const url = await generateVideo(prompt);
        await saveHistory('video', prompt, url, { url });
        return url;
      }}
      renderResult={() => (
        <View style={styles.resultWrap}>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>🎬</Text>
            <Text style={styles.placeholderText}>Video generated</Text>
            <Text style={styles.placeholderHint}>Video playback requires a native build. The clip URL is saved to your history.</Text>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  resultWrap: { gap: 12 },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
  },
  placeholderIcon: { fontSize: 48 },
  placeholderText: { ...typography.subheading, color: colors.text },
  placeholderHint: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
});
