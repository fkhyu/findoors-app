import { rooms } from '@/assets/placeholder/rooms';
import Accordion from '@/components/roomsAccordion';
import { Room } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function FloorScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const handlePressRoom = (room: Room) => {
    router.push(`/buildings/floors/rooms/${room.id}`);
  };

  const filtered = rooms.filter(r => r.floorId === slug);
  const bookable = filtered.filter(r => r.isBookable);
  const nonBookable = filtered.filter(r => !r.isBookable);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Accordion title="Bookable Rooms" data={bookable} handleRoomPress={handlePressRoom} />
      <Accordion title="Non-Bookable Rooms" data={nonBookable} handleRoomPress={handlePressRoom} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});