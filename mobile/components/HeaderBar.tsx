// mobile/components/HeaderBar.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const BLUE = '#CFE1FF';
const BLUE_DARK = '#4B4B76';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type HeaderBarProps = {
  title: string;
  leftIconName?: IconName;
  rightIconName?: IconName;
  onPressLeft?: () => void;
  onPressRight?: () => void;
};

const HEADER_HEIGHT = 100; // wie bei "MEINE THEMEN"

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  leftIconName,
  rightIconName,
  onPressLeft,
  onPressRight,
}) => {
  return (
    <View style={styles.header}>
      {/* Left Icon (oder Platzhalter damit der Titel zentriert bleibt) */}
      {leftIconName ? (
        <TouchableOpacity
          onPress={onPressLeft}
          activeOpacity={0.8}
          style={styles.iconButton}
        >
          <Ionicons name={leftIconName} size={36} color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}

      {/* Title */}
      <Text style={styles.headerTitle}>{title}</Text>

      {/* Right Icon (oder Platzhalter) */}
      {rightIconName ? (
        <TouchableOpacity
          onPress={onPressRight}
          activeOpacity={0.8}
          style={styles.iconButton}
        >
          <Ionicons name={rightIconName} size={32} color="#FFFFFF" />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: BLUE,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: BLUE_DARK,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  iconButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 40,
  },
});
