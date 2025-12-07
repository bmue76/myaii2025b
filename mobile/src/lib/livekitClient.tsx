// mobile/src/lib/livekitClient.ts
// LiveKit-Hilfen für React Native (ohne JSX / ohne eigene UI)

import { useEffect } from 'react';
import { AudioSession, registerGlobals } from '@livekit/react-native';

let globalsRegistered = false;

/**
 * Muss einmalig aufgerufen werden, bevor LiveKit im RN-Context genutzt wird.
 * Im Avatar-Screen rufen wir einfach ensureLiveKitGlobals() ganz oben auf.
 */
export function ensureLiveKitGlobals(): void {
  if (globalsRegistered) return;

  try {
    registerGlobals();
    globalsRegistered = true;
  } catch (err) {
    console.warn('[LiveKit] registerGlobals fehlgeschlagen', err);
  }
}

/**
 * Startet / stoppt die AudioSession für LiveKit.
 * Im Screen einfach: useLiveKitAudioSession();
 */
export function useLiveKitAudioSession(): void {
  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        await AudioSession.startAudioSession();
      } catch (err) {
        if (!cancelled) {
          console.warn('[LiveKit] startAudioSession fehlgeschlagen', err);
        }
      }
    };

    const stop = async () => {
      try {
        await AudioSession.stopAudioSession();
      } catch (err) {
        console.warn('[LiveKit] stopAudioSession fehlgeschlagen', err);
      }
    };

    start();

    return () => {
      cancelled = true;
      stop();
    };
  }, []);
}
