import { supabase } from '@/lib/supabase';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const SettingsScreen = () => {
  const [name, setName] = useState('Loading...');
  const [country, setCountry] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const uid = sessionData.session?.user.id;

      if (!uid) {
        setLoading(false);
        return;
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('name, country, age')
        .eq('id', uid)
        .single();

      if (!error && user) {
        setName(user.name || '');
        setCountry(user.country || '');
        setAge(user.age ?? null);
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontSize: 20, fontWeight: '600' },
          headerTintColor: '#333',
        }}
      />

      {/* Personal Info */}
      <Text style={styles.sectionTitle}>My Information</Text>
      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Enter your name"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            value={country}
            onChangeText={setCountry}
            style={styles.input}
            placeholder="Enter your country"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            value={age !== null ? String(age) : ''}
            onChangeText={(t) => setAge(t ? parseInt(t, 10) : null)}
            style={styles.input}
            placeholder="Enter your age"
            keyboardType="numeric"
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Preferences</Text> 
      <View style={styles.linksContainer}>
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.push('/passport/settings/change-house')}
        >
          <Text style={styles.linkText}>Change House</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => router.push('/passport/settings/change-stay-length')}
        >
          <Text style={styles.linkText}>Change Stay Length</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F0F2F5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  linksContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  linkButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});