// mobile/app/(tabs)/avatar.tsx

import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import HeaderBar from '../../components/HeaderBar';

const BG_LIGHT = '#F3F4F6';
const CARD_BG = '#CFE1FF';
const LABEL_TEXT = '#4B4B76';

export default function AvatarTabScreen() {
  const router = useRouter();

  const handleSelectAvatar = () => {
    // Platzhalter – wird in späterem Teilprojekt durch Avatar-Auswahl ersetzt
    alert('Die Auswahl deines AI Avatars folgt in einem späteren Teilprojekt.');
  };

  const handleCreateTwin = () => {
    // Platzhalter – wird in späterem Teilprojekt durch AI-Twin-Wizard ersetzt
    alert('Die Erstellung deines AI Twin folgt in einem späteren Teilprojekt.');
  };

  return (
    <View style={styles.screen}>
      {/* HeaderBar mit Icons und Profil-Link wie bei "Themen" */}
      <HeaderBar
        title="AI AVATAR"
        leftIconName="person-circle-outline"
        rightIconName="share-outline"
        onPressLeft={() => router.push('/profile')}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        bounces={false}
      >
        {/* Kachel 1: Avatar-Auswahl – mit extra Abstand zur HeaderBar */}
        <TouchableOpacity
          style={[styles.card, styles.firstCard]}
          activeOpacity={0.9}
          onPress={handleSelectAvatar}
        >
          {/* weiße Titelleiste, oben gerundet wie die Kachel, unten gerade */}
          <View style={styles.cardLabel}>
            <Text style={styles.cardLabelText}>
              WÄHLE EINEN AI AVATAR DEINER WAHL
            </Text>
          </View>

          {/* Bildbereich – aktuell Platzhalter */}
          <View style={styles.imageArea}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>
                Avatar-Galerie folgt
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Kachel 2: AI Twin */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.9}
          onPress={handleCreateTwin}
        >
          <View style={styles.cardLabel}>
            <Text style={styles.cardLabelText}>
              ERSTELLE DEINEN AI TWIN
            </Text>
          </View>

          <View style={styles.imageArea}>
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>
                AI-Twin-Wizard folgt
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  scroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 24,
    overflow: 'hidden', // Label + Bild bündig
    marginBottom: 16,
  },
  firstCard: {
    marginTop: 10, // extra Abstand zur HeaderBar
  },
  cardLabel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cardLabelText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: LABEL_TEXT,
  },
  imageArea: {
    padding: 10,
  },
  imagePlaceholder: {
    height: 190,
    borderRadius: 18,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  imagePlaceholderText: {
    color: '#E5E7EB',
    fontSize: 13,
    textAlign: 'center',
  },
});
