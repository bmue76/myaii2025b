// mobile/app/(tabs)/avatar.tsx

import React, { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  LiveKitRoom,
  VideoTrack,
  useTracks,
  isTrackReference,
} from '@livekit/react-native';
import { Track } from 'livekit-client';

import HeaderBar from '../../components/HeaderBar';

import {
  HeygenSession,
  isHeygenConfigured,
  sendTextToAvatar,
  startAvatarSession,
  stopAvatarSession,
} from '../../src/services/heygenStreaming';
import {
  ensureLiveKitGlobals,
  useLiveKitAudioSession,
} from '../../src/lib/livekitClient';
import { useUserProfile } from '../../src/hooks/useUserProfile';

// LiveKit-WebRTC globals registrieren (einmal pro Bundle)
ensureLiveKitGlobals();

type AvatarStatus = 'idle' | 'connecting' | 'connected' | 'error';

const GREETINGS = ['Hey', 'Hallo', 'Hi', 'Willkommen zurück'];

function buildGreeting(name?: string | null) {
  const base =
    GREETINGS[Math.floor(Math.random() * GREETINGS.length)] ?? 'Hey';
  if (name && name.trim().length > 0) {
    return `${base} ${name.trim()}, dein Avatar ist bereit.`;
  }
  return `${base}, dein Avatar ist bereit.`;
}

function RoomView() {
  const tracks = useTracks([Track.Source.Camera], { onlySubscribed: true });

  if (!tracks.length) {
    return (
      <View style={styles.videoPlaceholderInner}>
        <Text style={styles.videoPlaceholderText}>
          Avatar verbindet sich …
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.videoContainer}>
      {tracks.map((track, idx) =>
        isTrackReference(track) ? (
          <VideoTrack
            key={idx}
            style={styles.video}
            trackRef={track}
            objectFit="cover"
          />
        ) : null
      )}
    </View>
  );
}

export default function AvatarScreen() {
  const { profile } = useUserProfile();
  const [status, setStatus] = useState<AvatarStatus>('idle');
  const [session, setSession] = useState<HeygenSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  useLiveKitAudioSession();

  const greeting = useMemo(
    () => buildGreeting(profile?.name),
    [profile?.name]
  );

  const heygenReady = isHeygenConfigured();

  const handleStart = useCallback(async () => {
    if (!heygenReady) {
      setError(
        'HeyGen ist noch nicht konfiguriert (API-Key fehlt). Bitte .env prüfen.'
      );
      return;
    }

    try {
      setError(null);
      setStatus('connecting');

      const newSession = await startAvatarSession();
      setSession(newSession);
      setStatus('connected');
    } catch (e: any) {
      console.warn('[Avatar] startAvatarSession error', e);
      setStatus('error');
      setError(
        e?.message ??
          'Avatar-Session konnte nicht gestartet werden. Bitte später erneut versuchen.'
      );
    }
  }, [heygenReady]);

  const handleStop = useCallback(async () => {
    if (!session) return;

    try {
      setStatus('idle');
      await stopAvatarSession(session);
    } catch (e) {
      console.warn('[Avatar] stopAvatarSession error', e);
    } finally {
      setSession(null);
    }
  }, [session]);

  const handleSend = useCallback(async () => {
    if (!session || !text.trim()) return;

    try {
      setIsSending(true);
      setError(null);
      await sendTextToAvatar(session, text.trim(), 'talk');
      setText('');
    } catch (e: any) {
      console.warn('[Avatar] sendTextToAvatar error', e);
      setError(
        e?.message ??
          'Text konnte nicht an den Avatar gesendet werden. Bitte erneut versuchen.'
      );
    } finally {
      setIsSending(false);
    }
  }, [session, text]);

  const isConnected = status === 'connected';
  const isBusy = status === 'connecting' || isSending;

  const statusLabel = (() => {
    switch (status) {
      case 'idle':
        return 'Bereit';
      case 'connecting':
        return 'Verbindung wird aufgebaut …';
      case 'connected':
        return 'Live – Avatar ist verbunden';
      case 'error':
        return 'Fehler';
      default:
        return '';
    }
  })();

  return (
    <View style={styles.screen}>
      {/* Header kommt aus der gemeinsamen Komponente */}
      <HeaderBar title="Avatar" />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Begrüssung */}
          <View style={styles.section}>
            <Text style={styles.greetingText}>{greeting}</Text>
            <Text style={styles.sublineText}>
              Dein KI-Avatar begleitet dich durch den Alltag. Starte die Demo
              und lass ihn etwas sagen.
            </Text>
          </View>

          {/* Hinweis, falls HeyGen nicht konfiguriert */}
          {!heygenReady && (
            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>HeyGen nicht konfiguriert</Text>
              <Text style={styles.warningText}>
                Hinterlege deinen API Token in der{' '}
                <Text style={styles.codeText}>.env</Text> unter{' '}
                <Text style={styles.codeText}>
                  EXPO_PUBLIC_HEYGEN_API_KEY
                </Text>
                . Anschliessend App neu starten.
              </Text>
            </View>
          )}

          {/* Live-Avatar Card */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Live-Avatar Demo</Text>
              <View style={styles.statusPill}>
                <View
                  style={[
                    styles.statusDot,
                    isConnected
                      ? styles.statusDotOnline
                      : status === 'connecting'
                      ? styles.statusDotConnecting
                      : styles.statusDotIdle,
                  ]}
                />
                <Text style={styles.statusText}>{statusLabel}</Text>
              </View>
            </View>

            <Text style={styles.cardDescription}>
              Starte eine Session, verbinde dich mit HeyGen und sieh deinen
              Avatar in Echtzeit. Anschliessend kannst du Text eingeben, den er
              sprechen soll.
            </Text>

            <View style={styles.videoCard}>
              {session && isConnected ? (
                <LiveKitRoom
                  serverUrl={session.livekitUrl}
                  token={session.livekitToken}
                  connect={true}
                  options={{
                    adaptiveStream: { pixelDensity: 'screen' },
                  }}
                  audio={true}
                  video={true}
                >
                  <RoomView />
                </LiveKitRoom>
              ) : (
                <View style={styles.videoPlaceholderInner}>
                  <Text style={styles.videoPlaceholderText}>
                    Avatar noch nicht aktiv. Starte die Session, um den Stream
                    zu sehen.
                  </Text>
                </View>
              )}
            </View>

            {/* Start / Stop Buttons */}
            <View style={styles.buttonRow}>
              {!isConnected ? (
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    (!heygenReady || isBusy) && styles.buttonDisabled,
                  ]}
                  onPress={handleStart}
                  disabled={!heygenReady || isBusy}
                >
                  <Text style={styles.primaryButtonText}>
                    {status === 'connecting' ? 'Verbinden …' : 'Avatar starten'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    isBusy && styles.buttonDisabled,
                  ]}
                  onPress={handleStop}
                  disabled={isBusy}
                >
                  <Text style={styles.secondaryButtonText}>Avatar stoppen</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Text-Interaktion */}
            <View style={styles.textSection}>
              <Text style={styles.inputLabel}>
                Dem Avatar etwas sagen lassen
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Was soll dein Avatar sagen?"
                value={text}
                onChangeText={setText}
                editable={!!session && isConnected && !isSending}
                multiline
              />
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  (!session || !isConnected || !text.trim() || isSending) &&
                    styles.buttonDisabled,
                ]}
                onPress={handleSend}
                disabled={
                  !session || !isConnected || !text.trim() || isSending
                }
              >
                <Text style={styles.primaryButtonText}>
                  {isSending ? 'Senden …' : 'Sagen lassen'}
                </Text>
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 16,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sublineText: {
    fontSize: 14,
    color: '#4B5563',
  },
  warningBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FBBF24',
    marginBottom: 16,
  },
  warningTitle: {
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 13,
    color: '#92400E',
  },
  codeText: {
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    fontSize: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginRight: 6,
  },
  statusDotIdle: {
    backgroundColor: '#9CA3AF',
  },
  statusDotConnecting: {
    backgroundColor: '#FBBF24',
  },
  statusDotOnline: {
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 12,
    color: '#374151',
  },
  cardDescription: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 12,
  },
  videoCard: {
    borderRadius: 12,
    backgroundColor: '#111827',
    overflow: 'hidden',
    marginBottom: 12,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 9 / 16,
    backgroundColor: '#000000',
  },
  video: {
    flex: 1,
  },
  videoPlaceholderInner: {
    width: '100%',
    aspectRatio: 9 / 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#111827',
  },
  videoPlaceholderText: {
    color: '#D1D5DB',
    fontSize: 13,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#9CA3AF',
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  textSection: {
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  textInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 60,
    fontSize: 14,
    color: '#111827',
    marginBottom: 8,
    backgroundColor: '#F9FAFB',
  },
  errorBox: {
    marginTop: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    fontSize: 12,
    color: '#B91C1C',
  },
});
