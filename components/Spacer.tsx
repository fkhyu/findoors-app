import React from 'react';
import { StyleSheet, View } from 'react-native';

interface SpacerProps {
  width?: number;
}

const Spacer: React.FC<SpacerProps> = ({ width = 95 }) => {
  return (
    <View style={[styles.spacer, { width: `${width}%` }]}/>
  );
};

const styles = StyleSheet.create({
  spacer: {
    height: 2,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
    alignSelf: 'center',
  },
});

export default Spacer;