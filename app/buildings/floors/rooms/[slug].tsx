import { rooms } from '@/assets/placeholder/rooms';
import FeatureIcon from '@/components/featureIcon';
import Spacer from '@/components/Spacer';
import { MaterialIcons } from '@expo/vector-icons';
import { I18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const RoomDetails = () => {
  // Get the slug from the route parameters
  const { slug } = useLocalSearchParams();
  const router = useRouter();

  // Find the building by slug
  const room = rooms.find((r) => r.id === slug);
  if (!room) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}><Trans>Room not found</Trans></Text>
      </View>
    );
  }
  
  return (
    <I18nProvider i18n={I18n}>
    <ScrollView style={styles.container}>
      {room.imageUrl && (
        <Image
          source={{ uri: room.imageUrl }}
          style={{ width: '100%', height: '30%' }}
          resizeMode="cover"
        />
      )}
      <View style={styles.topContainer}>
        <View style={styles.topLeftContainer}>
          <Text style={styles.subtitle}>{room.name}</Text>
          <Text style={styles.htwo}>{room.number}</Text>
        </View>
        <View style={styles.topRightContainer}>
          <Text style={styles.htwoplus}>{room.capacity}</Text>
          <Text style={styles.hthree}><Trans>seats</Trans></Text>
        </View>
      </View>
      <View style={styles.topContainer}>
        <Pressable 
          style={({ pressed }) => [
            styles.topLeftButton,
            pressed && styles.pressed
          ]} 
          onPress={() => {
            router.push(`/schedule/${room.id}`);
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 500 }}><Trans>Book</Trans></Text>
        </Pressable>
        <Link style={styles.topRightButton} href={{pathname: "/", params: { roomId: room.id, floor: room.floorId }}} asChild>
          <Pressable style={({ pressed }) => [
              styles.topRightButton,
              pressed && styles.pressed
            ]}  
            onPress={() => {router.push(`/`);}}
          >
            <Text style={{ fontSize: 20, fontWeight: 600, }}><Trans>Show on Map</Trans></Text>
          </Pressable>
          </Link>
      </View>
      <View style={styles.bookingContainer}>
        <Text style={styles.title}><Trans>Booking Information</Trans></Text>
        <Text style={styles.subtitle}>
          {room.bookingInfo || 'No booking information available'}
        </Text>
      </View>
      { room.reservations && (
        <View style={styles.reservationsContainer}>
        <Text style={styles.title}>Reservations</Text>
        {room.reservations.length > 0 ? (
          room.reservations.map((reservation, index) => (
            <Text key={index} style={styles.subtitle}>
              {reservation}
            </Text>
          ))
        ) : (
          <Text style={styles.subtitle}>No reservations available</Text>
        )}
      </View>
      )}
      <Spacer/>
      <View style={styles.featuresContainer}>
        <Text style={{ fontSize: 20, fontWeight: 500, }}><Trans>Features</Trans></Text>
        <View style={{ flexDirection: 'row' }}>
          {room.features.length > 0 ? (
            room.features.map((feature, index) => (
              <FeatureIcon 
                key={index}
                name={feature}
                size={28}
                color={'#000'}
              />
            ))
          ) : (
            <Text style={styles.subtitle}>No features available</Text>
          )}
        </View>
      </View>
      <Spacer/>
      <View style={styles.reviewsContainer}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons 
              name="star"
              size={24}
              color="#FFD700"
            />
            <MaterialIcons 
              name="star"
              size={24}
              color="#FFD700"
            />
            <MaterialIcons 
              name="star"
              size={24}
              color="#FFD700"
            />
            <MaterialIcons 
              name="star"
              size={24}
              color="#FFD700"
            />
            <MaterialIcons 
              name="star"
              size={24}
              color="#FFD700"
            />
          </View>
          <Text style={{ fontSize: 14, fontWeight: 400, }}>5/5</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable 
            style={({ pressed }) => [
              styles.smallButton,
              pressed && styles.pressed
            ]} 
            onPress={() => {
              router.push(`/report/room/${room.id}`);
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 400 }}>Review</Text>
          </Pressable>
        </View>
      </View>
      <Spacer/>
      <View style={styles.reportContainer}>
        <Text style={{ fontSize: 20, fontWeight: 500, }}>Any issues?</Text>
        <Pressable 
          style={({ pressed }) => [
            styles.smallButton,
            pressed && styles.pressed
          ]} 
          onPress={() => {
            router.push(`/report/room/${room.id}`);
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 400 }}>Report</Text>
        </Pressable>
      </View>
    </ScrollView>
    </I18nProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  htwoplus: {
    fontSize: 22,
    fontWeight: 800,
    color: '#222',
  },
  hthree: {
    fontSize: 16,
    fontWeight: 500,
    color: '#555',
  },
  topContainer: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topLeftContainer: {
    width: '50%',
    alignItems: 'flex-start',
  },
  topRightContainer: {
    width: '50%',
    alignItems: 'flex-end',
  },
  topLeftButton: {
    width: '49%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#dbdbdb',
  },
  topRightButton: {
    width: '49%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#bfbfbf',
  },
  pressed: {
    opacity: 0.75,
  },
  bookingContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
  },
  reservationsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    marginTop: 10,
  },
  featuresContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reportContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  smallButton: {
    padding: 12,
    borderRadius: 8,
    paddingVertical: 6,
    backgroundColor: '#dedede',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default RoomDetails;