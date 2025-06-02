import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const FellowsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fellows Screen</Text>
      <Text style={styles.text}>Here you can see some fellow roommates!</Text>
      <Link href="/welcome/intro">
        <Text style={styles.text}>Continue</Text>
      </Link>
    </View>
  );
}

export default FellowsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    justifyContent: 'center',  
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: { 
    fontSize: 20,
    color: '#333',
  },    
}); 