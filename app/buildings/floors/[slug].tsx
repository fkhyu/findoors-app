import { getRoomsByFloor } from '@/components/functions/tables';
import Accordion from '@/components/roomsAccordion';
import { Room } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function FloorScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const fetchedRooms = await getRoomsByFloor(slug);
        setRooms(fetchedRooms);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };
    fetchRooms();
  }, [slug]);

  const handlePressRoom = (room: Room) => {
    router.push(`/buildings/floors/rooms/${room.id}`);
  };

  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text>Loading...</Text>
      </ScrollView>
    );
  }

  const bookable = rooms.filter(r => r.isBookable);
  const nonBookable = rooms.filter(r => !r.isBookable);

  console.log("Bookable rooms:", bookable);
  console.log("Non-bookable rooms:", nonBookable);

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