// mobile/src/hooks/useUserProfile.ts
// Einfacher Hook für das lokale Userprofil (Name, Phone, ... optional).

import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  name?: string | null;
  phone?: string | null;
}

const STORAGE_KEY = 'userProfile';

interface UseUserProfileResult {
  profile: UserProfile | null;
  loading: boolean;
}

/**
 * Liest ein gespeichertes Userprofil aus AsyncStorage.
 * Falls noch nichts gespeichert wurde, ist profile === null.
 */
export function useUserProfile(): UseUserProfileResult {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (!cancelled) {
          setProfile(parsed);
        }
      } catch (err) {
        console.warn('[useUserProfile] Fehler beim Laden des Profils', err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  return { profile, loading };
}
