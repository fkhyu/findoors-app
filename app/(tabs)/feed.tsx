import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const FeedScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Feed</Text>
      <View style={styles.content}>
        <Text style={styles.text}>This is the feed screen.</Text>
      </View>
    </ScrollView>
  );
}

export default FeedScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});