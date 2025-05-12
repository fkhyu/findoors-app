import { buildings } from '@/assets/placeholder/buildings';
import { useLocalSearchParams } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

const BuildingDetails = () => {
  // Get the slug from the route parameters
  const { slug } = useLocalSearchParams();

  // Find the building by slug
  const building = buildings.find((b) => b.id === slug);
  if (!building) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Building not found</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {building.imageUrl && (
        <Image
          source={{ uri: building.imageUrl }}
          style={{ width: '100%', height: '30%' }}
          resizeMode="cover"
        />
      )}
      <View style={styles.topContainer}>
        <Text style={styles.htwo}>{building.name}</Text>
        <Text style={styles.subtitle}>{building.id}</Text>
        <Text style={styles.subtitle}>{building.address}</Text>
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
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 12,
  },
});

export default BuildingDetails;