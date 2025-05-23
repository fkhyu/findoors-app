import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const FindRoomView = () => {
  return (
    <Pressable style={({pressed}) => [
      { opacity: pressed ? 0.7 : 1 },
      styles.container,
    ]}>
      <View style={styles.leftContainer}> 
        {/* Placeholder for room details */}
        
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.imagePlaceholder} />
        <Pressable style={({pressed}) => [
          { opacity: pressed ? 0.7 : 1 },
          styles.bookButton
        ]}>
          <Text style={styles.bookText}>Book</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default FindRoomView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    flexDirection: 'row',
    width: '100%',
  },
  leftContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#99f',
    padding: 20,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    height: '100%',
    width: '50%',
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#c33',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    height: 180,
    width: '50%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '75%',
    backgroundColor: '#ccc',
    borderTopRightRadius: 10,
  },
  bookButton: {
    alignItems: 'center',
    height: '25%',
    width: '100%',
    overflow: 'visible',
    justifyContent: 'center',
    borderBottomRightRadius: 10,
    backgroundColor: '#ff6347',
  },
  bookText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});