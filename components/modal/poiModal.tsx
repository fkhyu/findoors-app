import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { Dimensions, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

export type POIModalMethods = {
  snapToMax: () => void;
  snapToMid: () => void;
  close: () => void;
  present: () => void;
}

interface POI {
  id: string; // Corrected from Text to string
  lat: number;
  lon: number; 
  title: string;
  icon_url: string;
  address: string; // Assuming address is a string, adjust if necessary
  type: string; // sight, food, view, event, gem
  description?: string;
}

export interface POIModalProps {
  initialSnap?: 'max' | 'mid' | 'min';
  maxHeight?: number;
  midHeight?: number;
  minHeight?: number;
  selectedPoiData?: POI;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const openMapWithDirections = (lat: number, lon: number) => {
  let url = '';

  if (Platform.OS === 'ios') {
    // Apple Maps
    url = `http://maps.apple.com/?daddr=${lat},${lon}&dirflg=d`;
  } else {
    // Google Maps
    url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  }

  Linking.openURL(url).catch(err => console.error('Error launching map:', err));
};

const POIModal = forwardRef<POIModalMethods, POIModalProps>(
  (
    {
      initialSnap = 'mid',
      maxHeight = SCREEN_HEIGHT * 0.85,
      midHeight = SCREEN_HEIGHT * 0.5,
      minHeight = SCREEN_HEIGHT * 0.3,
      selectedPoiData = {
        id: '',
        lat: 0,
        lon: 0,
        title: '',
        icon_url: '',
      } as POI, 
    },
    ref
  ) => {
    const sheetRef = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(
      () => [
        `${Math.round(minHeight / SCREEN_HEIGHT * 100)}%`,
        `${Math.round(midHeight / SCREEN_HEIGHT * 100)}%`,
        `${Math.round(maxHeight / SCREEN_HEIGHT * 100)}%`,
      ],
      [maxHeight, midHeight, minHeight]
    );

    const initialIndex = useMemo(() => {
      switch (initialSnap) {
        case 'max':
          return 2;
        case 'mid':
          return 1;
        default:
          return 0;
      }
    }, [initialSnap])

    const handlePresent = useCallback(() => {
      sheetRef.current?.present();
      sheetRef.current?.snapToIndex(initialIndex);
    }, [initialIndex]); 

    useImperativeHandle(ref, () => ({
      present: handlePresent,
      snapToMid: () => sheetRef.current?.snapToIndex(1),
      snapToMax: () => sheetRef.current?.snapToIndex(2),
      close: () => sheetRef.current?.close(),
    }));

    if (!selectedPoiData || !selectedPoiData.id) {
      return null; // Return null if no POI data is provided
    }

    return (
      <BottomSheetModal
        ref={sheetRef}
        index={initialIndex}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetView style={styles.content}>
          <Text style={styles.title}>{selectedPoiData.title}</Text>
          <Text style={styles.type}>
            {selectedPoiData.type === 'event' ? '🎟️ Event' :
            selectedPoiData.type === 'food' ? '🍽️ Food Spot' :
            selectedPoiData.type === 'view' ? '🌆 Scenic View' :
            selectedPoiData.type === 'hidden' ? '🕵️ Hidden Gem' :
            selectedPoiData.type === 'share' ? '📢 Shared Location' :
            selectedPoiData.type === 'uevent' ? '🎉 User Event' :
            '📍 Landmark'}
          </Text>

          {selectedPoiData.address ? (
            <Text style={styles.address}>{selectedPoiData.address}</Text> 
          ) : null}

          <View style={styles.CTAContainer}>
            <Pressable
              onPress={() => openMapWithDirections(selectedPoiData.lat, selectedPoiData.lon)}
              style={styles.directionsButton}
            >
              <MaterialIcons name="directions" size={24} color="#fff" />
              <Text style={styles.directionsText}>Get Directions</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                sheetRef.current?.close();s
                router.push(`/checkin/${selectedPoiData.id}`)
              }}
              style={styles.directionsButton}
            >
              <MaterialCommunityIcons name="location-enter" size={24} color="#fff" />
              <Text style={styles.directionsText}>Check-In</Text>
            </Pressable> 
          </View>

          {selectedPoiData.description ? (
            <Text style={styles.description}>{selectedPoiData.description}</Text>
          ) : null}

          {/* Future buttons/interactions can go here */}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
)

POIModal.displayName = 'POIModal';

export default POIModal;

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handle: { 
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ccc',
    marginVertical: 8,
  }, 
  content: {
    padding: 16, 
    paddingTop: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8, 
  },
  address: {
    fontSize: 14,
  },
  type: {
    fontSize: 14,
    color: '#6B7B78',
    marginBottom: 4,
    fontStyle: 'italic',
  }, 
  description: {
    fontSize: 15,
    color: '#444',
    marginTop: 8,
    marginBottom: 10,
  },
  hours: {
    fontSize: 14,
    color: '#888',
    marginBottom: 6,
  },
  visited: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  unvisited: {
    color: '#FF9800',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  photos: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4A261',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 8,
    flex: 1,
  },
  directionsText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  CTAContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
})