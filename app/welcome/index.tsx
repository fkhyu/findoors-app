import { supabase } from '@/lib/supabase';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import MapboxGL from '@rnmapbox/maps';
import { makeRedirectUri } from 'expo-auth-session';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// 🗝️ MapTiler style URL with key
const MAP_STYLE =
  'https://api.maptiler.com/maps/019717fd-a8fc-78fa-afaf-c660bbb6b406/style.json?key=XSJRg4GXeLgDiZ98hfVp';

// Starting center on SF
const START_COORD: [number, number] = [-122.401297, 37.773972];

const houses = [
  { id: 1, lat: 37.7626, lon: -122.4172 },
  { id: 2, lat: 37.7705, lon: -122.4456 },
  { id: 3, lat: 37.7486, lon: -122.4869 },
]

export default function WelcomeScreen() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);

  // Tiny circular drift
  useEffect(() => {
    let theta = 0;
    const radius = 0.003; // smaller radius for subtler motion
    const interval = setInterval(() => {
      theta += 0.015;
      const lon = START_COORD[0] + Math.cos(theta) * radius;
      const lat = START_COORD[1] + Math.sin(theta) * radius;
      cameraRef.current?.setCamera({
        centerCoordinate: [lon, lat],
        animationDuration: 12000,
      });
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const [email, setEmail] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');

  const handleEmailLogin = async () => {
    if (!email) {
      Alert.alert('Please enter a valid email address.');
      return;
    } else if (email === 'testmail') {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'kala@test.com',
        password: 'kala',
      });

      if (error) {
        Alert.alert('Login error', error.message);
        return;
      } else {
        Alert.alert('Success', 'Logged in using test credentials!');
        router.replace('/welcome/whoareyou'); 
        return;
      }
    }

    const redirectTo = makeRedirectUri()

    console.log('Redirect URI:', redirectTo);

    const { error } = await supabase.auth.signInWithOtp({  
      email,
      options: {    
        emailRedirectTo: redirectTo,  
      },
    });

    if (error) {
      Alert.alert('Login error', error.message);
    } else {
      Alert.alert('Success', 'A login link has been sent to your email.');
    }
  };

  const handleOtpLogin = async () => {
    if (!email || !otp) {
      Alert.alert('Please enter your email and the code you received.');
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (error) {
      Alert.alert('OTP Error', error.message);
    } else {
      Alert.alert('Success', 'Logged in! Taking you to your adventure...');
      router.replace('/welcome/whoareyou'); // Or wherever you want!
    }
  };

  return (
    <View style={styles.container}>
      {/* — Faint, non-interactive map backdrop */}
      <MapboxGL.MapView
        style={[StyleSheet.absoluteFill, styles.mapFaint]}
        styleURL={MAP_STYLE}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
        scaleBarEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          centerCoordinate={START_COORD}
          zoomLevel={10}
        />
        {houses.map((house) => (
          <MapboxGL.MarkerView
            key={house.id}
            coordinate={[house.lon, house.lat]}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#F4A261', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 15 }}>🏠</Text>
            </View>
          </MapboxGL.MarkerView>
        ))}
      </MapboxGL.MapView>

      {/* — Expo Router header */}
      <Stack.Screen options={{ title: 'Welcome!' }} />

      {/* — Overlayed UI */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Welcome to OtaMapSF</Text>
        <Text style={styles.subtitle}>Your Bay Area adventure starts now</Text>
        <Text style={styles.leaf}>🏠</Text>
        {/* <Link href="/" style={{ fontSize: 20, color: "#aaa" }}><Text>Skip onboarding (breaks things!)</Text></Link> */}
      </View>

      {/* — Pinned Get Started button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => bottomSheetRef.current?.snapToIndex(0)}
      >
        <Text style={styles.buttonText}>Get Started!</Text>
      </TouchableOpacity>

      <BottomSheet
        index={-1}
        snapPoints={['85%']}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: '#F0F8E8', // soft greenish-beige
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          borderWidth: 3,
          borderColor: '#B4CBA5', // muted leaf green border
          shadowColor: '#7A8D7B',
          shadowOpacity: 0.2,
          shadowRadius: 18,
          elevation: 10,
        }}
        ref={bottomSheetRef}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -30} // tweak as needed
        >
          <BottomSheetScrollView 
            contentContainerStyle={styles.sheetView} 
            keyboardShouldPersistTaps="handled"
          >
          <Text style={{ fontSize: 48, marginBottom: 6 }}>🏠</Text>
          <Text style={styles.sheetText}>Login to OtaMapSF</Text>
          <TextInput
            style={styles.input}
            placeholder="Your email address"
            placeholderTextColor="#B4CBA5"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity
            style={styles.sheetButton}
            onPress={handleEmailLogin}
          >
            <Text style={styles.sheetButtonText}>Send Login Email</Text>
          </TouchableOpacity>

          {/* OTP toggle and input */}
          <View style={{ marginTop: 8, alignItems: 'center', width: '100%', padding: 10, paddingTop: 0, }}>
            <Text style={styles.orText}>or</Text>
            <TouchableOpacity
              onPress={() => setShowOtpInput((v) => !v)}
              style={styles.otpToggle}
            >
              <Text style={styles.otpToggleText}>
                {showOtpInput ? 'Hide OTP login' : "Having trouble? Enter a code instead"}
              </Text>
            </TouchableOpacity>

            {showOtpInput && (
              <View style={styles.otpBox}>
                <Text style={styles.sheetTextSm}>Enter the code from your email:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="One-Time Password"
                  placeholderTextColor="#B4CBA5"
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={otp}
                  onChangeText={setOtp}
                />
                <TouchableOpacity
                  style={styles.sheetButton}
                  onPress={handleOtpLogin}
                >
                  <Text style={styles.sheetButtonText}>Log in with Code</Text>
                </TouchableOpacity>
                <Text style={styles.otpHint}>
                  (Check the same email for both the link and the code!) 
                </Text>
              </View>
            )}
          </View>
        </BottomSheetScrollView>
        </KeyboardAvoidingView>
      </BottomSheet>  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1 
  },
  mapFaint: {
    opacity: 0.3,
  },
  overlay: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#5C7C6E',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#7A8D7B',
    textAlign: 'center',
    marginBottom: 30,
  },
  leaf: {
    fontSize: 64,
    marginVertical: 20,
  },
  button: {
    position: 'absolute',
    bottom: 40,
    left: '10%',
    right: '10%',
    backgroundColor: '#F4A261',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  sheetView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
    backgroundColor: 'transparent', // parent handles bg
    paddingBottom: 98,
  },
  sheetText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#5C7C6E',
    marginBottom: 18,
    fontFamily: 'System', // swap for something rounder if you import it!
    letterSpacing: 1,
    textShadowColor: '#E1EDD6',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
    textAlign: 'center',
  },
  input: {
    width: '83%',
    height: 54,
    borderColor: '#B4CBA5',
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#546C5E',
    backgroundColor: '#FAFDF7',
    marginTop: 16,
    shadowColor: '#B4CBA5',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sheetButton: {
    marginTop: 28,
    width: 210,
    backgroundColor: '#F4A261',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#F4A261',
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#82A57A',
  },
  sheetButtonText: {
    color: '#FFF',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: 0.7,
  },
  orText: {
    marginBottom: 8,
    color: '#B4CBA5',
    fontSize: 18,
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  otpToggle: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    backgroundColor: '#E1EDD6',
    borderRadius: 20,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#B4CBA5',
  },
  otpToggleText: {
    color: '#5C7C6E',
    fontSize: 15,
    fontWeight: 'bold',
  },
  otpBox: {
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FAFDF7',
    borderRadius: 22,
    paddingVertical: 18,
    borderWidth: 2,
    borderColor: '#B4CBA5',
    shadowColor: '#B4CBA5',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sheetTextSm: {
    fontSize: 17,
    color: '#5C7C6E',
    marginBottom: 8,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  otpHint: {
    fontSize: 13,
    color: '#B4CBA5',
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});