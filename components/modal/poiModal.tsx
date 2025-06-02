import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';

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
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>{selectedPoiData.title}</Text>
        <Text style={styles.type}>
          {selectedPoiData.type === 'event' ? '🎟️ Event' :
          selectedPoiData.type === 'food' ? '🍽️ Food Spot' :
          selectedPoiData.type === 'view' ? '🌆 Scenic View' :
          selectedPoiData.type === 'hidden' ? '🕵️ Hidden Gem' :
          '📍 Landmark'}
        </Text>

        {selectedPoiData.address ? (
          <Text style={styles.address}>{selectedPoiData.address}</Text>
        ) : null}

        {selectedPoiData.description ? (
          <Text style={styles.description}>{selectedPoiData.description}</Text>
        ) : null}

        {/* <TouchableOpacity style={styles.button}><Text>Navigate Here</Text></TouchableOpacity> */}
      </BottomSheetView>
    )
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
})