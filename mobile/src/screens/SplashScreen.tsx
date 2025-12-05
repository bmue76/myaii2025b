// mobile/src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { getUserProfile } from '../services/userStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const profile = await getUserProfile();

        setTimeout(() => {
          if (!isMounted) {
            return;
          }

          if (profile && profile.isOnboarded) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }, 1500);
      } catch (error) {
        console.warn('Error while loading user profile', error);

        setTimeout(() => {
          if (!isMounted) {
            return;
          }

          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }, 1500);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [navigation]);

  const year = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Text style={styles.logo}>MYAII</Text>
        <Text style={styles.claim}>YOUR CO-PILOT IN LIFE</Text>
      </View>

      <View style={styles.bottomArea}>
        <ActivityIndicator size="small" />
        <Text style={styles.copyright}>© {year} MYAII</Text>
      </View>
    </View>
  );
};

const MYAII_BLUE = '#D6ECFF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MYAII_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 4,
    marginBottom: 8,
  },
  claim: {
    fontSize: 16,
    letterSpacing: 1,
  },
  bottomArea: {
    position: 'absolute',
    bottom: 32,
    alignItems: 'center',
  },
  copyright: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
  },
});

export default SplashScreen;
