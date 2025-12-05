// mobile/app/(tabs)/tagebuch.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

import HeaderBar from '../../components/HeaderBar';

const BLUE = '#CFE1FF';        // Header / Footer / Akzente
const BLUE_DARK = '#4B4B76';   // Akzent / Texte
const BACKGROUND = '#F7F8FC';  // Content-Background
const CARD_BORDER = '#E0E4F0';

type EmojiValue = 'awful' | 'bad' | 'ok' | 'good' | 'great';

type DiaryEntry = {
  dateKey: string;
  moodEmoji?: EmojiValue | null;
  sleepEmoji?: EmojiValue | null;
};

type QuickNote = {
  id: string;
  dateKey: string;
  createdAt: number;
  text: string;
};

const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

function getDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatDateLabel(date: Date): string {
  const today = new Date();
  const weekday = WEEKDAYS[date.getDay()];
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();

  if (isSameDate(date, today)) {
    return `Heute, ${weekday}, ${day}. ${month} ${year}`;
  }

  return `${weekday}, ${day}. ${month} ${year}`;
}

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / (60 * 60000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60000));

  if (diffMin < 1) return 'vor wenigen Sekunden';
  if (diffMin < 60) return `vor ${diffMin} min`;
  if (diffHours < 24) return `vor ${diffHours} h`;
  if (diffDays < 7) return `vor ${diffDays} Tagen`;

  const d = new Date(timestamp);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

export default function TagebuchScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [entries, setEntries] = useState<Record<string, DiaryEntry>>({});
  const [quickNotes, setQuickNotes] = useState<QuickNote[]>([]);

  const [isNoteModalVisible, setNoteModalVisible] = useState(false);
  const [tempNoteText, setTempNoteText] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const dateKey = useMemo(() => getDateKey(selectedDate), [selectedDate]);
  const today = useMemo(() => new Date(), []);

  const router = useRouter();

  const currentEntry: DiaryEntry | undefined = entries[dateKey];

  const latestNoteForCurrentDay: QuickNote | null = useMemo(() => {
    const filtered = quickNotes.filter((n) => n.dateKey === dateKey);
    if (filtered.length === 0) return null;
    const sorted = [...filtered].sort((a, b) => b.createdAt - a.createdAt);
    return sorted[0];
  }, [quickNotes, dateKey]);

  const lastFiveNotes: QuickNote[] = useMemo(() => {
    const sorted = [...quickNotes].sort((a, b) => b.createdAt - a.createdAt);
    return sorted.slice(0, 5);
  }, [quickNotes]);

  const handleChangeDay = (offset: number) => {
    setSelectedDate((prev: Date) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + offset);
      return next;
    });
  };

  const ensureEntryForCurrentDay = (): DiaryEntry => {
    const existing = entries[dateKey];
    if (existing) return existing;
    const newEntry: DiaryEntry = { dateKey, moodEmoji: null, sleepEmoji: null };
    setEntries((prev: Record<string, DiaryEntry>) => ({
      ...prev,
      [dateKey]: newEntry,
    }));
    return newEntry;
  };

  const handleMoodEmojiPress = (value: EmojiValue) => {
    setEntries((prev: Record<string, DiaryEntry>) => {
      const current = prev[dateKey] ?? { dateKey, moodEmoji: null, sleepEmoji: null };
      return {
        ...prev,
        [dateKey]: {
          ...current,
          moodEmoji: current.moodEmoji === value ? null : value,
        },
      };
    });
  };

  const handleSleepEmojiPress = (value: EmojiValue) => {
    setEntries((prev: Record<string, DiaryEntry>) => {
      const current = prev[dateKey] ?? { dateKey, moodEmoji: null, sleepEmoji: null };
      return {
        ...prev,
        [dateKey]: {
          ...current,
          sleepEmoji: current.sleepEmoji === value ? null : value,
        },
      };
    });
  };

  const openNewNoteModal = () => {
    ensureEntryForCurrentDay();
    setEditingNoteId(null);
    setTempNoteText('');
    setNoteModalVisible(true);
  };

  const openEditNoteFromList = (note: QuickNote) => {
    setSelectedDate(new Date(note.dateKey));
    setEditingNoteId(note.id);
    setTempNoteText(note.text);
    setNoteModalVisible(true);
  };

  const handleSaveNote = () => {
    const trimmed = tempNoteText.trim();
    if (!trimmed) {
      Alert.alert('Hinweis', 'Bitte gib zuerst eine Notiz ein.');
      return;
    }

    const now = Date.now();

    setQuickNotes((prev: QuickNote[]) => {
      if (editingNoteId) {
        // Bestehende Notiz bearbeiten
        return prev.map((note) =>
          note.id === editingNoteId ? { ...note, text: trimmed } : note
        );
      }

      // Neue Notiz für den aktuellen Tag
      const newNote: QuickNote = {
        id: `${dateKey}-${now}`,
        dateKey,
        createdAt: now,
        text: trimmed,
      };
      return [newNote, ...prev];
    });

    setNoteModalVisible(false);
    setTempNoteText('');
    setEditingNoteId(null);
  };

  const shortSnippet = latestNoteForCurrentDay?.text
    ? latestNoteForCurrentDay.text.length > 60
      ? latestNoteForCurrentDay.text.slice(0, 60) + '…'
      : latestNoteForCurrentDay.text
    : 'Tippe, um eine Notiz zu erfassen';

  const isToday = isSameDate(selectedDate, today);

  return (
    <View style={styles.container}>
      {/* Gemeinsame HeaderBar mit Profil-Link links & Kalender rechts */}
      <HeaderBar
        title="MEIN TAGEBUCH"
        leftIconName="person-circle-outline"
        rightIconName="calendar-clear-outline"
        onPressLeft={() => router.push('/profile')}
        onPressRight={() =>
          Alert.alert(
            'Kalender',
            'Direkte Datumsauswahl folgt in der finalen Version.'
          )
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Datum / Tagesnavigation */}
        <View style={styles.dateBar}>
          <TouchableOpacity
            style={styles.dateArrow}
            onPress={() => handleChangeDay(-1)}
          >
            <Ionicons name="chevron-back" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.dateLabelWrapper}>
            <Text style={styles.dateLabel}>{formatDateLabel(selectedDate)}</Text>
            {isToday && (
              <Text style={styles.dateSubLabel}>Heutiger Eintrag</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.dateArrow}
            onPress={() => handleChangeDay(1)}
          >
            <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Stimmung */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Wie geht es dir heute?</Text>
          <View style={styles.emojiRow}>
            {renderEmoji('😣', 'awful', currentEntry?.moodEmoji, handleMoodEmojiPress)}
            {renderEmoji('🙁', 'bad', currentEntry?.moodEmoji, handleMoodEmojiPress)}
            {renderEmoji('😐', 'ok', currentEntry?.moodEmoji, handleMoodEmojiPress)}
            {renderEmoji('😊', 'good', currentEntry?.moodEmoji, handleMoodEmojiPress)}
            {renderEmoji('🤩', 'great', currentEntry?.moodEmoji, handleMoodEmojiPress)}
          </View>
        </View>

        {/* Schlaf */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Wie hast du geschlafen?</Text>
          <View style={styles.emojiRow}>
            {renderEmoji('😵‍💫', 'awful', currentEntry?.sleepEmoji, handleSleepEmojiPress)}
            {renderEmoji('🥱', 'bad', currentEntry?.sleepEmoji, handleSleepEmojiPress)}
            {renderEmoji('😴', 'ok', currentEntry?.sleepEmoji, handleSleepEmojiPress)}
            {renderEmoji('🙂', 'good', currentEntry?.sleepEmoji, handleSleepEmojiPress)}
            {renderEmoji('💤', 'great', currentEntry?.sleepEmoji, handleSleepEmojiPress)}
          </View>
        </View>

        {/* Schnelle Notiz */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons
                name="pencil-outline"
                size={18}
                color={BLUE_DARK}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.sectionTitle}>Schnelle Notiz</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.quickNoteBox}
            onPress={openNewNoteModal}
            activeOpacity={0.9}
          >
            <Text
              style={[
                styles.quickNoteText,
                !latestNoteForCurrentDay && styles.quickNotePlaceholder,
              ]}
              numberOfLines={3}
            >
              {shortSnippet}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Foto-Upload (Fake-UI) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons
                name="image-outline"
                size={18}
                color={BLUE_DARK}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.sectionTitle}>Foto hinzufügen</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={() =>
              Alert.alert(
                'Foto-Upload',
                'Foto-Upload wird in einer späteren Version aktiviert.'
              )
            }
          >
            <Ionicons
              name="cloud-upload-outline"
              size={20}
              color={BLUE_DARK}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.uploadText}>Foto auswählen oder aufnehmen</Text>
          </TouchableOpacity>
        </View>

        {/* Sprachaufnahme (Fake-UI) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons
                name="mic-outline"
                size={18}
                color={BLUE_DARK}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.sectionTitle}>Sprachaufnahme</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.voiceButton}
            onPress={() =>
              Alert.alert(
                'Sprachaufnahme',
                'Sprachaufnahme wird in einer späteren Version aktiviert.'
              )
            }
          >
            <Ionicons
              name="mic-circle-outline"
              size={22}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.voiceButtonText}>Sprachmemo aufnehmen</Text>
          </TouchableOpacity>
        </View>

        {/* Letzte Einträge */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Letzte Einträge</Text>
          {lastFiveNotes.length === 0 ? (
            <Text style={styles.emptyText}>Noch keine Einträge vorhanden.</Text>
          ) : (
            lastFiveNotes.map((note) => (
              <TouchableOpacity
                key={note.id}
                style={styles.lastEntryItem}
                onPress={() => openEditNoteFromList(note)}
              >
                <View style={styles.lastEntryIconCircle}>
                  <Ionicons
                    name="document-text-outline"
                    size={16}
                    color={BLUE_DARK}
                  />
                </View>
                <View style={styles.lastEntryTextWrapper}>
                  <Text style={styles.lastEntryText} numberOfLines={1}>
                    {note.text}
                  </Text>
                  <Text style={styles.lastEntryMeta}>
                    {formatRelativeTime(note.createdAt)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Notiz-Modal (Keyboard-safe) */}
      <Modal
        visible={isNoteModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setNoteModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingNoteId ? 'Notiz bearbeiten' : 'Neue Notiz'}
              </Text>
              <TouchableOpacity onPress={() => setNoteModalVisible(false)}>
                <Ionicons name="close" size={24} color={BLUE_DARK} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.noteModalInput}
              multiline
              textAlignVertical="top"
              placeholder="Deine Notiz ..."
              placeholderTextColor="#B0B4C5"
              value={tempNoteText}
              onChangeText={setTempNoteText}
            />

            <Pressable style={styles.modalSaveButton} onPress={handleSaveNote}>
              <Text style={styles.modalSaveButtonText}>
                Speichern & Schliessen
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function renderEmoji(
  emoji: string,
  value: EmojiValue,
  selected?: EmojiValue | null,
  onPress?: (v: EmojiValue) => void
) {
  const isActive = selected === value;
  return (
    <TouchableOpacity
      key={value}
      style={[styles.emojiBubble, isActive && styles.emojiBubbleActive]}
      onPress={() => onPress && onPress(value)}
      activeOpacity={0.8}
    >
      <Text style={[styles.emojiText, isActive && styles.emojiTextActive]}>
        {emoji}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
  dateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: BLUE_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabelWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: BLUE_DARK,
  },
  dateSubLabel: {
    fontSize: 11,
    color: '#8A8FA3',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: BLUE_DARK,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  emojiBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  emojiBubbleActive: {
    backgroundColor: BLUE,
    borderColor: BLUE_DARK,
  },
  emojiText: {
    fontSize: 22,
  },
  emojiTextActive: {
    transform: [{ scale: 1.05 }],
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickNoteBox: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  quickNoteText: {
    fontSize: 13,
    color: BLUE_DARK,
  },
  quickNotePlaceholder: {
    color: '#A0A4B8',
  },
  uploadBox: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 13,
    color: BLUE_DARK,
  },
  voiceButton: {
    marginTop: 10,
    borderRadius: 24,
    backgroundColor: BLUE_DARK,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  voiceButtonText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 12,
    color: '#A0A4B8',
    marginTop: 6,
  },
  lastEntryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  lastEntryIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  lastEntryTextWrapper: {
    flex: 1,
  },
  lastEntryText: {
    fontSize: 13,
    color: BLUE_DARK,
  },
  lastEntryMeta: {
    fontSize: 11,
    color: '#8A8FA3',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: BACKGROUND,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: BLUE_DARK,
  },
  noteModalInput: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: CARD_BORDER,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: BLUE_DARK,
    textAlignVertical: 'top',
    marginBottom: 16,
    minHeight: 140,
    maxHeight: 220,
  },
  modalSaveButton: {
    borderRadius: 20,
    backgroundColor: BLUE_DARK,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalSaveButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
