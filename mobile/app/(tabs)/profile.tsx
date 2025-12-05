// mobile/app/(tabs)/profile.tsx
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderBar from '../../components/HeaderBar';
import {
  getUserProfile,
  saveUserProfile,
  clearUserProfile,
} from '../../src/services/userStorage';

type UserProfile = {
  name?: string;
  phone?: string;
  email?: string | null;
  language?: string | null;
};

const STORAGE_KEYS = {
  USER_NAME: 'myaii_user_name',
};

function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function ProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState<'de' | 'en'>('de');
  const [dailyReminder, setDailyReminder] = useState(true);
  const [avatarPush, setAvatarPush] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = (await getUserProfile()) as UserProfile | null;
        if (stored) {
          setName(stored.name ?? '');
          setPhone(stored.phone ?? '');
          setEmail(stored.email ?? '');
          if (stored.language === 'en') {
            setLanguage('en');
          } else {
            setLanguage('de');
          }
        }
      } catch (error) {
        console.error('Fehler beim Laden des Profils:', error);
      }
    };

    load();
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const trimmedName = name.trim();
      const updated: UserProfile = {
        name: trimmedName,
        phone: phone.trim(),
        email: email.trim() || null,
        language,
      };

      // 1) Im zentralen userStorage speichern
      await saveUserProfile(updated as any);

      // 2) Name zusätzlich im Simplified-Key für den Avatar hinterlegen
      if (trimmedName) {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_NAME, trimmedName);
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_NAME);
      }

      Alert.alert('Gespeichert', 'Dein Profil wurde aktualisiert.');
      router.push('/avatar');
    } catch (error) {
      console.error('Fehler beim Speichern des Profils:', error);
      Alert.alert(
        'Fehler',
        'Beim Speichern deines Profils ist ein Fehler aufgetreten.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Möchtest du dich wirklich abmelden?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearUserProfile();
              await AsyncStorage.removeItem(STORAGE_KEYS.USER_NAME);
              router.replace('/login');
            } catch (error) {
              console.error('Fehler beim Logout:', error);
              Alert.alert(
                'Fehler',
                'Beim Logout ist ein Fehler aufgetreten.'
              );
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleShowPlaceholderInfo = (title: string) => {
    Alert.alert(
      title,
      'Diese Funktion wird in einer späteren Version von MYAII ergänzt.'
    );
  };

  const handleBackToAvatar = () => {
    router.push('/avatar');
  };

  const handleShareProfile = () => {
    Alert.alert(
      'Bald verfügbar',
      'Profil teilen / Export wird später ergänzt.'
    );
  };

  return (
    <View style={styles.container}>
      {/* HeaderBar wie bei den anderen Screens */}
      <HeaderBar
        title="MEIN PROFIL"
        leftIconName="person-circle-outline"
        rightIconName="share-outline"
        onPressLeft={handleBackToAvatar}
        onPressRight={handleShareProfile}
      />

      {/* Inhalt – der Tab-Footer kommt automatisch vom (tabs)-Layout */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header-Sektion mit grossem Avatar */}
        <View style={styles.headerSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{getInitials(name)}</Text>
          </View>
          <Text style={styles.headerName}>{name || 'Dein Name'}</Text>
          <Text style={styles.headerSubtitle}>
            Verwalte dein Profil und deine App-Einstellungen.
          </Text>
        </View>

        {/* Basisdaten */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basisdaten</Text>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Dein Name"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Handy-Nummer</Text>
            <TextInput
              style={styles.input}
              placeholder="+41 ..."
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>E-Mail (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="deine@mail.ch"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        {/* Einstellungen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Einstellungen</Text>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.rowTitle}>Sprache</Text>
              <Text style={styles.rowSubtitle}>
                Aktuell nur für das Interface relevant.
              </Text>
            </View>
            <View style={styles.languageToggleContainer}>
              <TouchableOpacity
                style={[
                  styles.languagePill,
                  language === 'de' && styles.languagePillActive,
                ]}
                onPress={() => setLanguage('de')}
              >
                <Text
                  style={[
                    styles.languagePillText,
                    language === 'de' && styles.languagePillTextActive,
                  ]}
                >
                  DE
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languagePill,
                  language === 'en' && styles.languagePillActive,
                ]}
                onPress={() => setLanguage('en')}
              >
                <Text
                  style={[
                    styles.languagePillText,
                    language === 'en' && styles.languagePillTextActive,
                  ]}
                >
                  EN
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.rowTitle}>Daily Check-in Reminder</Text>
              <Text style={styles.rowSubtitle}>
                Erinnerungen für dein tägliches Coaching.
              </Text>
            </View>
            <Switch
              value={dailyReminder}
              onValueChange={setDailyReminder}
            />
          </View>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.rowTitle}>
                Push bei neuen Avatar-Nachrichten
              </Text>
              <Text style={styles.rowSubtitle}>
                Benachrichtigungen, wenn dein Avatar etwas für dich hat.
              </Text>
            </View>
            <Switch value={avatarPush} onValueChange={setAvatarPush} />
          </View>
        </View>

        {/* App & Datenschutz */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App & Datenschutz</Text>

          <TouchableOpacity
            style={styles.navRow}
            onPress={() =>
              handleShowPlaceholderInfo('Datenschutz & Nutzungsbedingungen')
            }
          >
            <Text style={styles.navRowTitle}>
              Datenschutz & Nutzungsbedingungen
            </Text>
            <Text style={styles.navRowChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navRow}
            onPress={() => handleShowPlaceholderInfo('Daten exportieren')}
          >
            <Text style={styles.navRowTitle}>Daten exportieren</Text>
            <Text style={styles.navRowChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navRow}
            onPress={() => handleShowPlaceholderInfo('Konto löschen')}
          >
            <Text style={[styles.navRowTitle, styles.navRowTitleDestructive]}>
              Konto löschen
            </Text>
            <Text style={styles.navRowChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Aktionen */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.primaryButton, isSaving && styles.primaryButtonDisabled]}
            disabled={isSaving}
            onPress={handleSave}
          >
            <Text style={styles.primaryButtonText}>
              {isSaving ? 'Speichere ...' : 'Änderungen speichern'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEF2FF',
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#C9D9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarInitials: {
    fontSize: 30,
    fontWeight: '700',
    color: '#243B6B',
  },
  headerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  fieldGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    maxWidth: 220,
  },
  languageToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 999,
    padding: 2,
  },
  languagePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  languagePillActive: {
    backgroundColor: '#4B6FFF',
  },
  languagePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  languagePillTextActive: {
    color: '#FFFFFF',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navRowTitle: {
    fontSize: 14,
    color: '#111827',
  },
  navRowTitleDestructive: {
    color: '#B91C1C',
  },
  navRowChevron: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  actionsSection: {
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: '#4B6FFF',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  logoutButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#DC2626',
    paddingVertical: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
});
