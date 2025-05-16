import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const BleTester = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BLE Tester</Text>
      <Text style={styles.description}>
        This is a placeholder for the Bluetooth Low Energy tester screen.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

export default BleTester;