import { rooms } from '@/assets/placeholder/rooms';
import { useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

const RoomDetails = () => {
  // Get the slug from the route parameters
  const { slug } = useLocalSearchParams();

  // Find the building by slug
  const room = rooms.find((r) => r.id === slug);
  if (!room) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Room not found</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {room.imageUrl && (
        <Image
          source={{ uri: room.imageUrl }}
          style={{ width: '100%', height: '30%' }}
          resizeMode="cover"
        />
      )}
      <View style={styles.topContainer}>
        <Text style={styles.htwo}>{room.name}</Text>
        <Text style={styles.subtitle}>{room.id}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
  },
  htwo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  topContainer: {
    width: '100%',
    height: '15%',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 12,
  },
});

export default RoomDetails;