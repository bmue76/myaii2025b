// mobile/app/(tabs)/freunde.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

// Pfad ggf. anpassen, falls du Aliases verwendest (z. B. "@/components/HeaderBar")
import HeaderBar from '../../components/HeaderBar';

type Friend = {
  id: string;
  name: string;
  status: string;
  activeTopic?: string;
};

const FRIENDS: Friend[] = [
  {
    id: '1',
    name: 'Patricia Seidl',
    status: 'Zuletzt aktiv vor 2 Std.',
    activeTopic: 'Stress & Entspannung',
  },
  {
    id: '2',
    name: 'Diego Baldenweg',
    status: 'Online',
    activeTopic: 'Motivation & Fokus',
  },
  {
    id: '3',
    name: 'Kim Hilario',
    status: 'Aktiv vor 1 Tag',
    activeTopic: 'Selbstvertrauen stärken',
  },
  {
    id: '4',
    name: 'Nadine E. Moor',
    status: 'Aktiv vor 3 Tagen',
    activeTopic: 'Schlaf & Erholung',
  },
  {
    id: '5',
    name: 'Nani Khakshouri',
    status: 'Aktiv vor 1 Woche',
    activeTopic: 'Achtsamkeit',
  },
];

const INVITES_PLACEHOLDER = [
  {
    id: 'inv1',
    text: 'Du hast aktuell keine offenen Einladungen.',
    subtext: 'Sobald dich jemand einlädt, erscheint die Anfrage hier.',
  },
];

function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function FreundeScreen() {
  const router = useRouter();

  const handleInviteFriend = () => {
    Alert.alert(
      'Bald verfügbar',
      'Freunde einladen wird in einer späteren Version von MYAII freigeschaltet.'
    );
  };

  const handleFriendActions = (friend: Friend) => {
    Alert.alert(
      friend.name,
      'Freunde-Aktionen (Chat, Favorisieren, Entfernen) werden später ergänzt.'
    );
  };

  const handleOpenProfile = () => {
    router.push('/profile');
  };

  return (
    <View style={styles.container}>
      {/* Gemeinsame HeaderBar (aus Teilprojekt 1.3) */}
      <HeaderBar
        title="MEINE FREUNDE"
        leftIconName="person-circle-outline" // Profil
        rightIconName="person-add-outline"   // Freund einladen
        onPressLeft={handleOpenProfile}
        onPressRight={handleInviteFriend}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Sektion: Einladungen */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Einladungen</Text>
          {INVITES_PLACEHOLDER.map((invite) => (
            <View key={invite.id} style={styles.card}>
              <Text style={styles.cardTitle}>{invite.text}</Text>
              <Text style={styles.cardSubtitle}>{invite.subtext}</Text>
            </View>
          ))}
        </View>

        {/* Sektion: Deine Freunde */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deine Freunde</Text>
          {FRIENDS.map((friend) => (
            <View key={friend.id} style={styles.friendCard}>
              <View style={styles.friendAvatar}>
                <Text style={styles.friendAvatarText}>
                  {getInitials(friend.name)}
                </Text>
              </View>
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{friend.name}</Text>
                <Text style={styles.friendStatus}>{friend.status}</Text>
                {friend.activeTopic ? (
                  <Text style={styles.friendTopic}>
                    Aktiv in: {friend.activeTopic}
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => handleFriendActions(friend)}
              >
                <Text style={styles.moreButtonText}>⋯</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Hinweis: Content-Sektion „Freund einladen“ ist entfernt.
            Die Einladen-Funktion hängt jetzt am Header-Icon rechts. */}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2933',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  friendAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D1DEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  friendAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2A4D',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  friendStatus: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  friendTopic: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
  moreButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  moreButtonText: {
    fontSize: 22,
    lineHeight: 22,
    color: '#4B5563',
  },
});
