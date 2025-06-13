import { supabase } from '@/lib/supabase';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  const [name, setName] = React.useState('Loading...');
  const [country, setCountry] = React.useState('');
  const [age, setAge] = React.useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    const fetchUserData = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const uid = sessionData.session?.user.id;

      if (!uid) {
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', uid)
        .single();

      console.log('User data:', user, 'Error:', error);

      if (!error && user) {
        setName(user.name || 'Unnamed');
        setCountry(user.country || '');
        setAge(user.age || null);
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerTitleStyle: { fontSize: 20 },
          headerStyle: { backgroundColor: '#f8f8f8' },
          headerTintColor: '#333',
        }}
      />
      <View style={styles.content}>
        <Text style={styles.subtitle}>My Information</Text>
        <Text style={styles.label}>Name:</Text>
        <TextInput defaultValue={name} style={styles.value}/>
        <Text style={styles.label}>Country:</Text>
        <TextInput defaultValue={country} style={styles.value}/>
        <Text style={styles.label}>Age:</Text>
        <TextInput defaultValue='' style={styles.value}>{age !== null ? age.toString() : 'N/A'}</TextInput>
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 18,
    marginLeft: 8
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
  },
});