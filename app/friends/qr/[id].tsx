import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeScreen = () => {
  const { id } = useLocalSearchParams();
  const qrText = 'findoors://friends/add/' + id;

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Your Friend Code',
          headerTitleStyle: { fontSize: 20 },
          headerStyle: { backgroundColor: '#f8f8f8' },
          headerTintColor: '#333',
        }}
      />
      <Text style={styles.title}>Your Friend Code</Text>
      <QRCode
        value={qrText}
        size={200} 
        color="black"
        backgroundColor="white"
      />
      <Text style={styles.codeText}>{id}</Text>
    </View> 
  );
}

export default QRCodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  codeText: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});