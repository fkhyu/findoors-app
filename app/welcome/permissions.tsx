import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const pastelGreen = '#E6F5DE';
const mainText = '#5C7C6E';
const accent = '#F4A261';

const PermissionsScreen = () => {
  const [locationStatus, setLocationStatus] = useState('');
  const [notifStatus, setNotifStatus] = useState('');

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return setLocationStatus('Denied');

    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
    setLocationStatus(bgStatus === 'granted' ? 'Granted' : 'Foreground only');
  };

  const requestNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotifStatus(status);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🔐 Permissions</Text>
      <Text style={styles.subtext}>
        We ask for a few things so the app can feel like your summer neighborhood.
      </Text>

      <TouchableOpacity style={styles.card} onPress={requestLocation}>
        <Text style={styles.emoji}>📍</Text>
        <View>
          <Text style={styles.cardTitle}>Location Access</Text>
          <Text style={styles.cardText}>To show you and your friends on the map</Text>
        </View>
        <Text style={styles.status}>{locationStatus}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={requestNotifications}>
        <Text style={styles.emoji}>🔔</Text>
        <View>
          <Text style={styles.cardTitle}>Notifications</Text>
          <Text style={styles.cardText}>To let you know when events happen or friends are nearby</Text>
        </View>
        <Text style={styles.status}>{notifStatus}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.continueBtn}
        onPress={() => router.push('/welcome/intro')}
      >
        <Text style={styles.continueText}>Continue →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default PermissionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: pastelGreen,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: mainText,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 15,
    color: '#7A8D7B',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  emoji: {
    fontSize: 28,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: mainText,
  },
  cardText: {
    fontSize: 14,
    color: '#6B7B78',
    marginTop: 2,
    maxWidth: 200,
  },
  status: {
    marginLeft: 'auto',
    fontSize: 13,
    color: '#8FA49C',
    fontStyle: 'italic',
  },
  continueBtn: {
    backgroundColor: accent,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});