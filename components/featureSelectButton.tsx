import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

const FeatureSelectButton = ({ feature, onPress, icon, title }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      { opacity: pressed ? 0.7 : 1 },
      styles.container,
    ]}>
      <MaterialIcons name={icon} size={28} color="black" />
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

export default FeatureSelectButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    flexDirection: 'row',
    width: '33%',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  }
})