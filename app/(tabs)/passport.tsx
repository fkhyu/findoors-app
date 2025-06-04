import { supabase } from '@/lib/supabase';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PassportScreen = () => {
  const [name, setName] = useState('Loading...');
  const [country, setCountry] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
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
      {/* 📘 Passport Header */}
      <View style={styles.passportHeader}>
        <View style={styles.pfpBlock}>
          <Image
            source={{
              uri: `https://ui-avatars.com/api/?name=${name.replace(
          / /g,
          '+'
              )}&background=random&size=150`,
            }}
            style={styles.pfp}
          />
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.country}>
              {country ? `🌍 ${country}` : '🌍 Unknown'}
              {age !== null ? ` · 🎂 ${age}` : ''}
            </Text>
          </View>
        </View>
        <View style={styles.progressBlock}>
          <View style={styles.circle}>
            <Text style={styles.progressText}>75%</Text>
            <Text style={styles.label}>Explored</Text>
          </View>
        </View>
      </View>

      {/* 🎒 Feature Buttons */}
      <View style={styles.buttonGrid}>
        <Link href="/passport/badges" asChild>
          <TouchableOpacity style={styles.gridButton}>
            <Text style={styles.emoji}>🏅</Text>
            <Text>Badges</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/passport/friends" asChild>
          <TouchableOpacity style={styles.gridButton}>
            <Text style={styles.emoji}>🧑‍🤝‍🧑</Text>
            <Text>Friends</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/passport/settings" asChild>
          <TouchableOpacity style={styles.gridButton}>
            <Text style={styles.emoji}>⚙️</Text>
            <Text>Settings</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/explore" asChild>
          <TouchableOpacity style={styles.gridButton}>
            <Text style={styles.emoji}>🌍</Text>
            <Text>Discover</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* 🔐 Auth Status / Login Link */}
      {!isLoggedIn && (
        <Link style={styles.quote} href="/welcome">
          “You're not logged in! Click me to login”
        </Link>
      )}

      {isLoggedIn && (
        <TouchableOpacity
          style={styles.quote}
          onPress={async () => {
            await supabase.auth.signOut();
            setIsLoggedIn(false);
            setName('Loading...');
            setCountry('');
            setAge(null);
            router.push('/welcome');
          }}
        >
          <Text>Log Out</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default PassportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFDF7',
    alignItems: 'center',
    paddingTop: 20,
  },
  passportHeader: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 18,
    width: '90%',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  pfpBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  pfp: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#546C5E',
  },
  country: {
    fontSize: 14,
    color: '#7A8D7B',
  },
  progressBlock: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E1EDD6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A685C',
  },
  label: {
    fontSize: 10,
    color: '#6B7B78',
  },
  buttonGrid: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  gridButton: {
    width: '47%',
    backgroundColor: '#F0F8E8',
    paddingVertical: 24,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#B4CBA5',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  quote: {
    marginTop: 40,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    color: '#8FA49C',
  },
});