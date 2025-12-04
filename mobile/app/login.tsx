// mobile/app/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { saveUserProfile } from '../src/services/userStorage';

const BACKGROUND = '#CFE1FF';
const BUTTON = '#4B4B76';
const INPUT_BACKGROUND = '#FFFFFF';
const TEXT_LIGHT = '#FFFFFF';
const TEXT_DARK = '#5E647C';
const PLACEHOLDER = '#B0B3C3';
const LOGO = require('../assets/myaII-logo.png'); // ggf. Pfad anpassen

export default function LoginScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim().replace(/\s+/g, '');

    if (!trimmedName) {
      setError('Bitte gib deinen Namen ein.');
      return false;
    }

    if (trimmedPhone.length < 6) {
      setError('Bitte gib eine gültige Handy-Nummer ein.');
      return false;
    }

    setError(null);
    return true;
  };

  const handleContinue = async () => {
    // Tastatur explizit schliessen
    Keyboard.dismiss();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await saveUserProfile({
        name: name.trim(),
        phone: phone.trim(),
      });

      router.replace('/home');
    } catch (e) {
      console.error('Failed to save user profile', e);
      setError('Beim Speichern ist ein Fehler aufgetreten. Bitte versuche es nochmals.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const year = new Date().getFullYear();

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.inner}>
            {/* Logo-Bereich */}
            <View style={styles.logoWrapper}>
              <Image source={LOGO} style={styles.logo} resizeMode="contain" />
            </View>

            {/* Formular-Bereich */}
            <View style={styles.form}>
              <Text style={styles.label}>WIE HEISST DU?</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  placeholder=""
                />
              </View>

              <Text style={[styles.label, styles.labelSpacing]}>
                WIE LAUTET DEINE HANDY NUMMER*
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="+41 79 123 45 67"
                  placeholderTextColor={PLACEHOLDER}
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                />
              </View>

              <Text style={styles.smsHint}>
                *ES WIRD DIR EIN SMS CODE ZUGESTELLT UM DICH ANZUMELDEN
              </Text>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity
                style={[styles.button, isSubmitting && styles.buttonDisabled]}
                onPress={handleContinue}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>
                  {isSubmitting ? 'SPEICHERE…' : 'CODE EINGEBEN'}
                </Text>
                <Text style={styles.buttonArrow}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.copyRight}>
                © {year} MYAII GMBH ALL RIGHTS RESERVED
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 24,
    paddingBottom: 24,
  },
  logoWrapper: {
    alignItems: 'center',
    marginTop: 48,
  },
  logo: {
    width: 336,
    height: 120,
  },
  form: {
    marginTop: 40,
  },
  label: {
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: TEXT_LIGHT,
    marginBottom: 6,
  },
  labelSpacing: {
    marginTop: 20,
  },
  inputWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: INPUT_BACKGROUND,
  },
  input: {
    paddingHorizontal: 18,
    paddingVertical: 19,
    fontSize: 16,
    color: '#333333',
  },
  smsHint: {
    marginTop: 10,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: TEXT_LIGHT,
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: '#D32F2F',
  },
  button: {
    marginTop: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BUTTON,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 32,
    minWidth: 220,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: TEXT_LIGHT,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  buttonArrow: {
    color: TEXT_LIGHT,
    fontSize: 18,
    marginLeft: 10,
    marginTop: -2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  copyRight: {
    fontSize: 9,
    letterSpacing: 1,
    color: TEXT_DARK,
    textAlign: 'center',
  },
});
