import { Entypo, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const FeatureIcon = ({ name, color, size }) => {
  if (!name) {
    return null;
  }

  if (name === 'tv') {
    return (
      <View style={styles.iconContainer}>
        <MaterialIcons name={name} size={size} color={color} />
      </View>
    );
  } else if (name === 'kitchen') {
    return (
      <View style={styles.iconContainer}>
        <MaterialIcons name={name} size={size} color={color} />
      </View>
    );
  } else if (name === 'blackboard') {
    return (
      <View style={styles.iconContainer}>
        <Entypo name={name} size={size} color={color} />
      </View>
    );
  }

}

export default FeatureIcon;

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});