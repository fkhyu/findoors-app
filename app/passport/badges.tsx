// app/screens/StampsScreen.js
import { useAchievements } from '@/lib/AchievementContext';
import { STAMP_DEFINITIONS } from '@/lib/stamps';
import { Stack } from 'expo-router';
import React, { useMemo } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const STICKER_SIZE = width / 3;

export default function StampsScreen() {
  const { achievements } = useAchievements();

  // Merge definitions with unlocked status and random layout
  const stamps = useMemo(
    () =>
      STAMP_DEFINITIONS.map((stamp) => ({
        ...stamp,
        unlocked: achievements.some((a) => a.id === stamp.id),
        rotation: (Math.random() - 0.5) * 30,
        margin: 12 + Math.random() * 12,
      })),
    [achievements]
  );

  // Chunk into pages of 6
  const pages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < stamps.length; i += 6) {
      chunks.push(stamps.slice(i, i + 6));
    }
    return chunks;
  }, [stamps]);

  const renderStamp = (stamp) => (
    <View
      key={stamp.id}
      style={[
        styles.sticker,
        { transform: [{ rotate: `${stamp.rotation}deg` }], margin: stamp.margin },
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
  pagingContainer: {},
  page: {
    width,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignContent: 'space-around',
    paddingBottom: 40,
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