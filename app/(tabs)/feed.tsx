import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

const FeedScreen = () => {

  return (
    <View style={styles.container}>
      <FlatList
        data={null}
        refreshControl={null}
        renderItem={<FeedItem/>}
      />
    </View>
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

const FeedItem = () => {
  return (
    <View style={fStyles.container}>

    </View>
  )
}

const fStyles = StyleSheet.create({
  container: {

  }
})