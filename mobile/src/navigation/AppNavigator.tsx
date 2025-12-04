// mobile/src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import AvatarPlaceholderScreen from '../screens/AvatarPlaceholderScreen';

export type RootStackParamList = {
  Home: undefined;
  AvatarPlaceholder: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'MYAII Coach' }}
        />
        <Stack.Screen
          name="AvatarPlaceholder"
          component={AvatarPlaceholderScreen}
          options={{ title: 'Avatar-Demo' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
