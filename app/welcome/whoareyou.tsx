import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const pastelGreen = '#E6F5DE';
const mainText = '#5C7C6E';
const accent = '#F4A261';

export default function UserInfoScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [age, setAge] = useState('');

  const handleSubmit = async () => {
    if (!name || !country || !age) {
      Alert.alert('Missing info', 'Please fill out all fields.');
      return;
    }

    const parsedAge = parseInt(age);
    if (isNaN(parsedAge) || parsedAge <= 0) {
      Alert.alert('Invalid age', 'Please enter a valid number.');
      return;
    }

    const { data: session } = await supabase.auth.getSession();
    const user = session?.session?.user;

    if (!user) {
      Alert.alert('Auth error', 'User not logged in.');
      return;
    }

    const { error } = await supabase.from('users').upsert({
      id: user.id,
      email: user.email,
      name,
      country,
      age: parsedAge,
      role: 'user',
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      await AsyncStorage.setItem('@findoors:name', name);
      router.push('/welcome/where');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>Let’s get to know you ✨</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Your Name</Text>
        <TextInput
          placeholder="e.g. Jamie"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Country</Text>
        <TextInput
          placeholder="e.g. Canada"
          style={styles.input}
          value={country}
          onChangeText={setCountry}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age</Text> 
        <TextInput
          placeholder="e.g. 17"
          keyboardType="numeric"
          style={styles.input}
          value={age}
          onChangeText={setAge}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Continue →</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: pastelGreen,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: mainText,
    textAlign: 'center',
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 26,
  },
  label: {
    fontSize: 16,
    color: mainText,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  button: {
    marginTop: 40,
    backgroundColor: accent,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: accent,
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});