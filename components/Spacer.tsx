import React from 'react';
import { StyleSheet, View } from 'react-native';

const Spacer = () => {
  return (
    <View style={styles.spacer}/>
  );
};

const styles = StyleSheet.create({
  spacer: {
    width: '95%',
    height: 2,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
});

export default Spacer;