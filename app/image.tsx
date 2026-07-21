import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { GenScreen } from '@/components/GenScreen';
import { generateImage, saveHistory } from '@/lib/ai';
import { colors, typography, radius } from '@/lib/theme';

const SUGGESTIONS = [
  'A serene mountain lake at sunset',
  'Cyberpunk city street at night',
  'Cute corgi in a space suit',
  'Minimalist abstract geometric art',
];

export default function ImageScreen() {
  return (
    <GenScreen
      title="Image Generator"
      subtitle="Describe an image and let AI bring it to life"
      emoji="🎨"
      placeholder="A beautiful landscape with…"
      suggestions={SUGGESTIONS}
      tool="image"
      generate={async (prompt) => {
        const url = await generateImage(prompt);
        await saveHistory('image', prompt, url, { url });
        return url;
      }}
      renderResult={(url) => (
        <View style={styles.resultWrap}>
          <Image source={{ uri: url }} style={styles.image} resizeMode="cover" />
          <Text style={styles.hint}>Image generated. Long press to save (coming soon).</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  resultWrap: { gap: 12, alignItems: 'center' },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceAlt,
  },
  hint: { ...typography.caption, color: colors.textSubtle, textAlign: 'center' },
});
