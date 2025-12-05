// mobile/src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { saveUserProfile } from '../services/userStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const MYAII_BLUE = '#D6ECFF';

const LoginScreen: React.FC<Props> = ({ navigation }) => {
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
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await saveUserProfile({
        name: name.trim(),
        phone: phone.trim(),
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (e) {
      console.error('Failed to save user profile', e);
      setError('Beim Speichern ist ein Fehler aufgetreten. Bitte versuche es nochmals.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.logo}>MYAII</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>WIE HEISST DU?</Text>
          <TextInput
            style={styles.input}
            placeholder="Dein Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
          />

          <Text style={[styles.label, styles.labelSpacing]}>WIE LAUTET DEINE HANDY NUMMER*</Text>
          <TextInput
            style={styles.input}
            placeholder="+41 ..."
            placeholderTextColor="#999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Speichere…' : 'CODE EINGEBEN'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.hintText}>
            *ES WIRD DIR EIN SMS CODE ZUGESTELLT UM DICH ANZUMELDEN
          </Text>
          <Text style={styles.hintSubText}>
            (In diesem Schritt ist dies noch ein Platzhalter. Die echte SMS-Verifizierung folgt in
            einem späteren Teilprojekt.)
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© {new Date().getFullYear()} MYAII</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MYAII_BLUE,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 4,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  labelSpacing: {
    marginTop: 24,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  errorText: {
    marginTop: 12,
    color: '#D32F2F',
    fontSize: 13,
  },
  button: {
    marginTop: 32,
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  hintText: {
    marginTop: 16,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  hintSubText: {
    marginTop: 4,
    fontSize: 11,
    opacity: 0.7,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.7,
  },
});

export default LoginScreen;
