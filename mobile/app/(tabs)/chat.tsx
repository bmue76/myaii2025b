// mobile/app/(tabs)/chat.tsx

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
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
import Ionicons from '@expo/vector-icons/Ionicons';

import { useRouter } from 'expo-router';
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

type ChatMessage = {
  id: string;
  sender: 'avatar' | 'user';
  text: string;
};

const BLUE = '#CFE1FF';
const BLUE_DARK = '#4B4B76';
const TAB_BAR_HEIGHT = 70; // aus deinem _layout.tsx

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

export default function ChatScreen() {
  const { profile } = useUserProfile();
  const router = useRouter();

  const [status, setStatus] = useState<AvatarStatus>('idle');
  const [session, setSession] = useState<HeygenSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasSentGreeting, setHasSentGreeting] = useState(false);
  const [inputHeight, setInputHeight] = useState(44);

  useLiveKitAudioSession();

  const heygenReady = isHeygenConfigured();
  const isConnected = status === 'connected';

  const displayName =
    profile?.name?.trim() ||
    (profile as any)?.firstName ||
    'du';

  const greetingText = `Hallo ${displayName}, worüber möchtest du heute sprechen?`;

  const handleStart = useCallback(async () => {
    if (!heygenReady || session || status === 'connecting') {
      return;
    }

    try {
      setError(null);
      setStatus('connecting');

      const newSession = await startAvatarSession();
      setSession(newSession);
      setStatus('connected');
    } catch (e: any) {
      console.warn('[Chat] startAvatarSession error', e);
      setStatus('error');
      setError(
        e?.message ??
          'Avatar-Session konnte nicht gestartet werden. Bitte später erneut versuchen.'
      );
    }
  }, [heygenReady, session, status]);

  const handleSend = useCallback(async () => {
    const content = text.trim();
    if (!session || !content) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'avatar', // aktuell: Text = das, was der Avatar sagt
      text: content,
    };

    setMessages((prev) => [...prev, newMsg]);
    setText('');
    setInputHeight(44);

    try {
      setIsSending(true);
      setError(null);
      await sendTextToAvatar(session, content, 'talk');
    } catch (e: any) {
      console.warn('[Chat] sendTextToAvatar error', e);
      setError(
        e?.message ??
          'Text konnte nicht an den Avatar gesendet werden. Bitte erneut versuchen.'
      );
    } finally {
      setIsSending(false);
    }
  }, [session, text]);

  // Avatar beim Betreten automatisch verbinden
  useEffect(() => {
    if (heygenReady && !session && status === 'idle') {
      void handleStart();
    }
  }, [heygenReady, session, status, handleStart]);

  // Begrüssungsnachricht
  useEffect(() => {
    if (session && isConnected && !hasSentGreeting) {
      const greetMsg: ChatMessage = {
        id: 'greet',
        sender: 'avatar',
        text: greetingText,
      };
      setMessages([greetMsg]);
      setHasSentGreeting(true);

      (async () => {
        try {
          await sendTextToAvatar(session, greetingText, 'talk');
        } catch (e) {
          console.warn('[Chat] greeting sendTextToAvatar error', e);
        }
      })();
    }
  }, [session, isConnected, hasSentGreeting, greetingText]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (session) {
        void stopAvatarSession(session).catch((e) =>
          console.warn('[Chat] cleanup stopAvatarSession error', e)
        );
      }
    };
  }, [session]);

  const disabledSend =
    !session || !isConnected || !text.trim() || isSending;

  return (
    <View style={styles.screen}>
      {/* Header oben */}
      <HeaderBar
        title="AI JULIA"
        leftIconName="person-circle-outline"
        rightIconName="share-outline"
        onPressLeft={() => router.push('/profile')}
      />

      {/* Body: Avatar + Chatverlauf */}
      <View style={styles.body}>
        {/* Avatar-Block oben */}
        <View style={styles.videoWrapper}>
          {session && isConnected ? (
            <LiveKitRoom
              serverUrl={session.livekitUrl}
              token={session.livekitToken}
              connect={true}
              options={{
                adaptiveStream: { pixelDensity: 'screen' },
              }}
              video={false} // kein Selfie
              audio={true}
            >
              <RoomView />
            </LiveKitRoom>
          ) : (
            <View style={styles.videoPlaceholderInner}>
              <Text style={styles.videoPlaceholderText}>
                Avatar verbindet sich …
              </Text>
            </View>
          )}
        </View>

        {/* Chatbereich unter dem Avatar */}
        <View style={styles.chatArea}>
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

          <ScrollView
            style={styles.chatScroll}
            contentContainerStyle={styles.chatScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.chatBubble,
                  msg.sender === 'avatar'
                    ? styles.chatBubbleAvatar
                    : styles.chatBubbleUser,
                ]}
              >
                <Text
                  style={[
                    styles.chatBubbleText,
                    msg.sender === 'avatar'
                      ? styles.chatBubbleTextAvatar
                      : styles.chatBubbleTextUser,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            ))}

            {messages.length === 0 && (
              <Text style={styles.chatPlaceholder}>
                Starte deinen ersten Satz für AI JULIA.
              </Text>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Eingabe-Bubble: fix unten, über Tab-Bar, wird mit KeyboardAvoidingView hochgeschoben */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={TAB_BAR_HEIGHT + 10} // etwas Reserve
      >
        <View style={styles.inputArea}>
          <View style={styles.composer}>
            <TextInput
              style={[styles.textInput, { height: inputHeight }]}
              placeholder="Was soll dein Avatar sagen?"
              placeholderTextColor="#9CA3AF"
              value={text}
              onChangeText={setText}
              editable={!!session && isConnected && !isSending}
              multiline
              onContentSizeChange={(e) => {
                const h = e.nativeEvent.contentSize.height;
                const min = 44;
                const max = 120;
                const next = Math.min(Math.max(min, h + 8), max);
                setInputHeight(next);
              }}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                disabledSend && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={disabledSend}
            >
              <Ionicons
                name={isSending ? 'time-outline' : 'paper-plane-outline'}
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  body: {
    flex: 1,
  },

  // Avatar: vollbreit, quadratisch, direkt unter Header
  videoWrapper: {
    width: '100%',
    backgroundColor: '#000000',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#000000',
  },
  video: {
    flex: 1,
  },
  videoPlaceholderInner: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#000000',
  },
  videoPlaceholderText: {
    color: '#D1D5DB',
    fontSize: 13,
    textAlign: 'center',
  },

  chatArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  chatScroll: {
    flex: 1,
  },
  chatScrollContent: {
    paddingBottom: 8,
  },

  chatBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    marginBottom: 8,
  },
  chatBubbleAvatar: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
  },
  chatBubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: BLUE,
    borderTopRightRadius: 4,
  },
  chatBubbleText: {
    fontSize: 14,
  },
  chatBubbleTextAvatar: {
    color: BLUE_DARK,
  },
  chatBubbleTextUser: {
    color: BLUE_DARK,
  },
  chatPlaceholder: {
    fontSize: 13,
    color: '#9CA3AF',
  },

  // Eingabe-Bereich: sitzt immer über der Tab-Bar
  inputArea: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: TAB_BAR_HEIGHT + 6, // Abstand zur Tab-Bar
    backgroundColor: 'transparent',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingHorizontal: 4,
    paddingVertical: 0,
  },
  sendButton: {
    marginLeft: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BLUE_DARK,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },

  warningBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FBBF24',
    marginBottom: 12,
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

  errorBox: {
    marginTop: 6,
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
