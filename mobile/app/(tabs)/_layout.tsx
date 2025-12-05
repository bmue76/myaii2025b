// mobile/app/(tabs)/_layout.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const BLUE = '#CFE1FF';        // Tab-Bar-Hintergrund
const BLUE_DARK = '#4B4B76';   // aktive Icons/Labels
const TAB_BAR_HEIGHT = 70;     // deine angepasste Höhe

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="avatar"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: BLUE,
          borderTopWidth: 0,
          height: TAB_BAR_HEIGHT,
        },
      }}
      // eigener Tab-Bar-Renderer (für Blöcke links/rechts + Chat-Bubble)
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {/* Reihenfolge egal – CustomTabBar steuert Anzeige */}
      <Tabs.Screen
        name="themen"
        options={{
          title: 'Themen',
        }}
      />
      <Tabs.Screen
        name="tagebuch"
        options={{
          title: 'Tagebuch',
        }}
      />
      <Tabs.Screen
        name="freunde"
        options={{
          title: 'Freunde',
        }}
      />
      <Tabs.Screen
        name="avatar"
        options={{
          title: 'Avatar',
        }}
      />
    </Tabs>
  );
}

// Eigene Tab-Bar mit 2 Blöcken + Chat-Bubble in der Mitte
function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.tabBar}>
      {/* Linker Block: Themen + Tagebuch */}
      <View style={styles.block}>
        {renderTab('avatar', 'person-circle-outline', 'Avatar', state, descriptors, navigation)}
        {renderTab('themen', 'flame-outline', 'Themen', state, descriptors, navigation)}
      </View>

      {/* Chat-Bubble in der Mitte */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => {
          // vorerst Avatar als Ziel – später Chat/Speech-To-Text
          navigation.navigate('avatar');
        }}
        activeOpacity={0.9}
      >
        <Ionicons
          name="chatbubble-ellipses-outline"
          size={26}
          color={BLUE_DARK}
        />
      </TouchableOpacity>

      {/* Rechter Block: Freunde + Avatar */}
      <View style={styles.block}>
        {renderTab('tagebuch', 'book-outline', 'Tagebuch', state, descriptors, navigation)}
        {renderTab('freunde', 'people-outline', 'Freunde', state, descriptors, navigation)}
      </View>
    </View>
  );
}

function renderTab(
  name: string,
  iconName: string,
  label: string,
  state: any,
  descriptors: any,
  navigation: any
) {
  const route = state.routes.find((r: any) => r.name === name);
  if (!route) {
    return null;
  }

  const isFocused = state.index === state.routes.indexOf(route);

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  return (
    <TouchableOpacity
      key={name}
      onPress={onPress}
      style={styles.tabItem}
      activeOpacity={0.8}
    >
      <Ionicons
        name={iconName as any}
        size={22}
        color={isFocused ? BLUE_DARK : '#FFFFFF'}
      />
      <Text
        style={[
          styles.tabLabel,
          { color: isFocused ? BLUE_DARK : '#FFFFFF' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    backgroundColor: BLUE,
    borderTopWidth: 0,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 2,
    paddingBottom: 18,
  },
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 4,
  },
  chatButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    borderColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
  },
});
