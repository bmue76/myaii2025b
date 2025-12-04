// mobile/src/services/userStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PROFILE_KEY = 'myaii:userProfile';

export type UserProfile = {
  name: string;
  phone: string;
  isOnboarded: boolean;
  createdAt: string;
};

export type UserProfileInput = {
  name: string;
  phone: string;
};

export async function saveUserProfile(input: UserProfileInput): Promise<void> {
  const profile: UserProfile = {
    ...input,
    isOnboarded: true,
    createdAt: new Date().toISOString(),
  };

  try {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save user profile', error);
    throw error;
  }
}

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const json = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (!json) {
      return null;
    }

    const profile = JSON.parse(json) as UserProfile;
    return profile;
  } catch (error) {
    console.error('Failed to load user profile', error);
    return null;
  }
}

export async function clearUserProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
  } catch (error) {
    console.error('Failed to clear user profile', error);
    throw error;
  }
}
