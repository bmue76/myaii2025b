// mobile/app/(tabs)/themen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import HeaderBar from '../../components/HeaderBar';

const BLUE = '#CFE1FF';        // Header/Footer
const BLUE_DARK = '#4B4B76';   // Akzent / Texte
const BACKGROUND = '#F7F8FC';  // helles Content-Background
const CARD_BORDER = '#E0E4F0';

const TOPICS = [
  'LIEBE & DATING',
  'SELBSTVERTRAUEN',
  'SCHULE',
  'STUDIUM & KARRIEREPLANUNG',
  'NEBENJOBS & GELDMANAGEMENT',
  'FREIZEIT & REISEN',
  'FITNESS & ERNÄHRUNG',
  'SOCIAL SKILLS & NETWORKING',
  'KREATIVITÄT & PROJEKTE',
  'ALLTAGSORGANISATION',
];

export default function ThemenScreen() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const router = useRouter();

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const hasMultiple = selectedTopics.length > 1;

  return (
    <View style={styles.container}>
      <HeaderBar
        title="MEINE THEMEN"
        leftIconName="person-circle-outline"
        rightIconName="share-outline"
        onPressLeft={() => router.push('/profile')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {TOPICS.map((topic) => {
          const isActive = selectedTopics.includes(topic);
          return (
            <TouchableOpacity
              key={topic}
              onPress={() => toggleTopic(topic)}
              activeOpacity={0.85}
              style={[
                styles.topicCard,
                isActive && styles.topicCardActive,
              ]}
            >
              <View style={styles.radioWrapper}>
                <View style={styles.radioOuter}>
                  {isActive && <View style={styles.radioInner} />}
                </View>
              </View>
              <Text style={styles.topicText}>{topic}</Text>
            </TouchableOpacity>
          );
        })}

        {hasMultiple && (
          <View style={styles.hintBox}>
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={BLUE_DARK}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.hintText}>
              Es ist ein monatliches Abomodell erforderlich, wenn du
              mehr als ein Thema auswählst.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,          // etwas kleinere Ecken
    paddingVertical: 12,       // höheres Feld
    paddingHorizontal: 14,
    marginBottom: 8,           // geringerer Abstand dazwischen
    borderWidth: 1,
    borderColor: CARD_BORDER,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  topicCardActive: {
    borderColor: BLUE_DARK,
  },
  radioWrapper: {
    marginRight: 12,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BLUE_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BLUE_DARK,
  },
  topicText: {
    flex: 1,
    color: BLUE_DARK,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  hintBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#E4ECFF',
  },
  hintText: {
    flex: 1,
    color: BLUE_DARK,
    fontSize: 12,
    lineHeight: 16,
  },
});
