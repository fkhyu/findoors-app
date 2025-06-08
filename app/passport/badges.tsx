import { Stack } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

const { width } = Dimensions.get('window');
const STICKER_SIZE = width / 3;

const sampleStamps = [
  { id: '1', name: 'Golden Gate Walker', unlocked: true, image: require('@/assets/stamps/goldengatewalker.png') },
  { id: '2', name: 'Mission Burrito', unlocked: false, image: 'https://via.placeholder.com/100?text=🌯' },
  { id: '3', name: 'Note to Self', unlocked: true, image: require('@/assets/stamps/notetoself.png') },
  { id: '4', name: 'Memory Maker', unlocked: false, image: require('@/assets/stamps/memorymaker.png') },
  { id: '5', name: 'Map Master', unlocked: true, image: 'https://via.placeholder.com/100?text=🗺️' },
  { id: '6', name: 'Hidden Stairway Explorer', unlocked: false, image: 'https://via.placeholder.com/100?text=🪜' },
  { id: '7', name: 'Hidden Stairway Explorer', unlocked: false, image: 'https://via.placeholder.com/100?text=🪜' },
  // …more stamps…
];

export default function StampsScreen() {
  // 1) Compute random rotations/margins once
  const stamps = useMemo(
    () => sampleStamps.map((stamp) => ({
      ...stamp,
      rotation: (Math.random() - 0.5) * 30,
      margin: 12 + Math.random() * 12,
    })),
    []
  );

  // 2) Chunk into pages of 6
  const pages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < stamps.length; i += 6) {
      chunks.push(stamps.slice(i, i + 6));
    }
    return chunks;
  }, [stamps]);

  // 3) Single-stamp renderer
  const renderStamp = (stamp) => (
    <View
      key={stamp.id}
      style={[
        styles.sticker,
        {
          transform: [{ rotate: `${stamp.rotation}deg` }],
          margin: stamp.margin,
        },
      ]}
    >
      <Image
        source={typeof stamp.image === 'string' ? { uri: stamp.image } : stamp.image}
        style={[styles.image, !stamp.unlocked && styles.lockedImage]}
      />
      {!stamp.unlocked && <Text style={styles.lock}>🔒</Text>}
      <Text style={[styles.label, !stamp.unlocked && styles.lockedLabel]} numberOfLines={2}>
        {stamp.name}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'My Passport Stamps',
          headerStyle: { backgroundColor: '#FAF3E0' },
          headerTitleStyle: { color: '#5C4B51', fontSize: 24, fontWeight: 'bold' },
          headerTintColor: '#5C4B51',
        }}
      />
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pagingContainer}
      >
        {pages.map((pageStamps, idx) => (
          <View style={styles.page} key={idx}>
            {pageStamps.map(renderStamp)}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3E0',
    paddingBottom: 30,
  },
  header: { 
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5C4B51',
    marginBottom: 20,
    alignSelf: 'center',
  },
  pagingContainer: {
    // pages themselves take care of width
  },
  page: {
    width,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignContent: 'space-around',
    paddingBottom: 40,
    paddingTop: 0,
  },
  sticker: {
    width: STICKER_SIZE,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#FFF5E5',
    padding: 8,
  },
  image: {
    width: STICKER_SIZE * 0.7,
    height: STICKER_SIZE * 0.7,
    resizeMode: 'contain',
  },
  lock: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 24,
    opacity: 0.6,
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#5C4B51',
    textAlign: 'center',
  },
  lockedLabel: {
    color: '#A69F9A',
  },
  lockedImage: {
    opacity: 0.5,
  },
});