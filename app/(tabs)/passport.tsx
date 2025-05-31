import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PassportScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fdfdfd', padding: 20, borderRadius: 10, width: '90%', flexDirection: 'row', gap: 20 }}>
        <View style={{ width: "50%", alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10 }}>
          <View>
            <Text style={styles.text}>Your Name</Text>
            <Text>🇫🇮 Finland</Text>
          </View>
        </View>
        <View style={{ width: "50%" }}>
          <Link href="/welcome"><Text>To Welcome</Text></Link>
        </View>
      </View>
    </SafeAreaView>
  ); 
}

export default PassportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});