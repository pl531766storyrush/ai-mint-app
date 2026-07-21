import { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { colors, typography, radius } from '@/lib/theme';

interface AudioPlayerProps {
  source: string;
}

export function AudioPlayer({ source }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const urls: string[] = source.startsWith('json:')
    ? JSON.parse(source.slice(5))
    : [source];

  const currentUrl = urls[chunkIndex] ?? urls[0];

  const loadChunk = useCallback((idx: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = urls[idx];
    audio.load();
  }, [urls]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const audio = new Audio();
    audioRef.current = audio;
    audio.preload = 'auto';

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration || 0);
    });

    audio.addEventListener('timeupdate', () => {
      setProgress(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      if (chunkIndex < urls.length - 1) {
        const next = chunkIndex + 1;
        setChunkIndex(next);
        loadChunk(next);
        audio.play().catch(() => setPlaying(false));
      } else {
        setPlaying(false);
        setProgress(0);
        setChunkIndex(0);
        loadChunk(0);
      }
    });

    loadChunk(0);

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  }, [playing]);

  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      if (urls.length === 1) {
        const res = await fetch(urls[0]);
        const blob = await res.blob();
        triggerDownload(blob, 'ai-mint-voice.mp3');
      } else {
        const blobs: Blob[] = [];
        for (const url of urls) {
          const res = await fetch(url);
          blobs.push(await res.blob());
        }
        const combined = new Blob(blobs, { type: 'audio/mpeg' });
        triggerDownload(combined, 'ai-mint-voice.mp3');
      }
      setDownloaded(true);
    } catch {
      // fallback: open in new tab
      if (Platform.OS === 'web') {
        window.open(urls[0], '_blank');
      }
    } finally {
      setDownloading(false);
    }
  }, [urls]);

  const pct = duration > 0 ? (progress / duration) * 100 : 0;
  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.waveform}>
        {[...Array(20)].map((_, i) => {
          const active = (i / 20) * 100 <= pct;
          return (
            <View
              key={i}
              style={[
                styles.bar,
                { height: 8 + ((i * 7) % 40) },
                active && styles.barActive,
              ]}
            />
          );
        })}
      </View>

      <Text style={styles.timeText}>
        {fmtTime(progress)} / {fmtTime(duration)}
        {urls.length > 1 ? `  ·  Part ${chunkIndex + 1}/${urls.length}` : ''}
      </Text>

      <View style={styles.controls}>
        <Pressable
          onPress={togglePlay}
          style={({ pressed }) => [
            styles.playBtn,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.playBtnText}>{playing ? '⏸  Pause' : '▶  Play'}</Text>
        </Pressable>

        <Pressable
          onPress={handleDownload}
          disabled={downloading}
          style={({ pressed }) => [
            styles.dlBtn,
            downloading && styles.dlBtnDisabled,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={styles.dlBtnText}>
            {downloading ? 'Downloading…' : downloaded ? '✓ Downloaded' : '⬇  Download'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function triggerDownload(blob: Blob, filename: string) {
  if (Platform.OS !== 'web') return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
    padding: 8,
    width: '100%',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 48,
  },
  bar: {
    width: 4,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
  },
  barActive: {
    backgroundColor: colors.primary,
  },
  timeText: {
    ...typography.caption,
    color: colors.textMuted,
    fontVariant: ['tabular-nums'],
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  playBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnText: {
    color: colors.textOnPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  dlBtn: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dlBtnDisabled: {
    opacity: 0.5,
  },
  dlBtnText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 15,
  },
});
