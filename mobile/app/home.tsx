// mobile/app/home.tsx
import React from 'react';
import { Redirect } from 'expo-router';

export default function HomeRedirect() {
  // Route-Gruppen wie (tabs) werden aus dem Pfad entfernt -> Pfad ist /avatar
  return <Redirect href="/avatar" />;
}