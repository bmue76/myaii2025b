// mobile/app/index.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { getUserProfile } from '../src/services/userStorage';

const BACKGROUND = '#CFE1FF';
const LOGO = require('../assets/myaII-logo.png'); // ggf. Pfad anpassen

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const profile = await getUserProfile();

        setTimeout(() => {
          if (!isMounted) return;

          if (profile && profile.isOnboarded) {
            router.replace('/home');
          } else {
            router.replace('/login');
          }
        }, 1500);
      } catch (error) {
        console.warn('Error reading user profile on splash', error);

        setTimeout(() => {
          if (!isMounted) return;
          router.replace('/login');
        }, 1500);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const year = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.bottomArea}>
        <ActivityIndicator size="small" />
        <Text style={styles.copyright}>
          © {year} MYAII GMBH ALL RIGHTS RESERVED
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 336,
    height: 120,
  },
  bottomArea: {
    position: 'absolute',
    bottom: 32,
    alignItems: 'center',
    alignSelf: 'center',
  },
  copyright: {
    marginTop: 12,
    fontSize: 9,
    letterSpacing: 1,
    color: '#5E647C',
    textAlign: 'center',
  },
});
