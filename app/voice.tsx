import { View, Text, StyleSheet } from 'react-native';
import { GenScreen } from '@/components/GenScreen';
import { AudioPlayer } from '@/components/AudioPlayer';
import { generateVoice, saveHistory } from '@/lib/ai';
import { colors, typography, radius } from '@/lib/theme';

const SUGGESTIONS = [
  'Welcome to AI Mint, your creative companion.',
  'The quick brown fox jumps over the lazy dog.',
  'Today is a beautiful day to create something new.',
];

export default function VoiceScreen() {
  return (
    <GenScreen
      title="Voice Generator"
      subtitle="Turn text into natural-sounding speech"
      emoji="🎙️"
      placeholder="Type the text you want spoken…"
      suggestions={SUGGESTIONS}
      tool="voice"
      generate={async (prompt) => {
        const url = await generateVoice(prompt);
        await saveHistory('voice', prompt, url, { url });
        return url;
      }}
      renderResult={(url) => (
        <View style={styles.resultWrap}>
          <AudioPlayer source={url} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  resultWrap: { alignItems: 'center', gap: 14, padding: 16 },
});
