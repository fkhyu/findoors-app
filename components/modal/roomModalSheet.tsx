import { supabase } from '@/lib/supabase';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView
} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export type RoomModalMethods = {
  snapToMax: () => void;
  snapToMid: () => void;
  close: () => void;
  present: () => void;
};

export interface RoomModalProps {
  roomId?: string;
  initialSnap?: 'max' | 'mid' | 'min';
  maxHeight?: number;
  midHeight?: number;
  minHeight?: number;
}

type Room = {
  id: string;
  room_number: string;
  title: string | null;
  description: string | null;
  seats: number | null;
  type: string | null;
  equipment: any;           // your JSONB column
  wilma_id: string | null;
  bookable: boolean | null;
  image_url: string | null;
  created_at: string;
};

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const RoomModal = forwardRef<RoomModalMethods, RoomModalProps>(
  (
    {
      roomId,
      initialSnap = 'mid',
      maxHeight = SCREEN_HEIGHT * 0.85,
      midHeight = SCREEN_HEIGHT * 0.5,
      minHeight = SCREEN_HEIGHT * 0.3,
    },
    ref
  ) => {
    const sheetRef = useRef<BottomSheetModal>(null);
    const [roomInfo, setRoomInfo] = useState<Room | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);

    const snapPoints = useMemo(
      () => [
        `${Math.round(minHeight / SCREEN_HEIGHT * 100)}%`,
        `${Math.round(midHeight / SCREEN_HEIGHT * 100)}%`,
        `${Math.round(maxHeight / SCREEN_HEIGHT * 100)}%`,
      ],
      [minHeight, midHeight, maxHeight]
    );

    const initialIndex = useMemo(() => {
      switch (initialSnap) {
        case 'max': return 2;
        case 'mid': return 1;
        default:    return 0;
      }
    }, [initialSnap]);

    const handlePresent = useCallback(() => {
      sheetRef.current?.present();
      sheetRef.current?.snapToIndex(initialIndex);
    }, [initialIndex]);

    const handleSheetChanges = useCallback((index: number) => {
      console.log('Sheet position changed to', index);
    }, []);

    useImperativeHandle(ref, () => ({
      present: handlePresent,
      snapToMid: () => sheetRef.current?.snapToIndex(1),
      snapToMax: () => sheetRef.current?.snapToIndex(2),
      close: () => sheetRef.current?.close(),
    }));

    
    useEffect(() => {
      if (!roomId) return;
    
      const fetchImages = async () => {
        const { data: room } = await supabase
          .from('rooms')
          .select('*')
          .eq('room_number', roomId)
          .single();
        if (!room) return;
    
        const { data: files, error: listErr } = await supabase
          .storage
          .from('room-images')
          .list(room.id, { limit: 100 });
        if (listErr) return console.error(listErr);
    
        // ← filter out placeholders
        const imageFiles = files.filter(f =>
          f.metadata?.mimetype?.startsWith('image/') &&
          !f.name.startsWith('.')            // or use the extension test above
        );
    
        const urls = imageFiles.map(f =>
          supabase
            .storage
            .from('room-images')
            .getPublicUrl(`${room.id}/${f.name}`)
            .data.publicUrl
        );
    
        setImageUrls(urls);
        setRoomInfo(room);
        handlePresent();
      };
    
      fetchImages();
    }, [roomId]);

    return (
      <BottomSheetModal
        ref={sheetRef}
        index={initialIndex}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetView style={styles.content}>
          {roomInfo ? (
            <View>
              {/* Display the human-friendly room number */}
              <Text style={styles.id}>{roomInfo.room_number}</Text>
              
              {roomInfo.title && (
                <Text style={styles.title}>{roomInfo.title}</Text>
              )}

              {imageUrls.length > 0 && (
                <BottomSheetScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  style={styles.carouselContainer}
                >
                  {imageUrls.map((uri, idx) => (
                    <Image
                      key={idx}
                      source={{ uri }}
                      style={styles.carouselImage}
                      resizeMode="cover"
                    />
                  ))}
                </BottomSheetScrollView>
              )}
              
              {roomInfo.description && (
                <Text style={styles.description}>{roomInfo.description}</Text>
              )}

              <View style={styles.detailRow}>
                <Text>Paikkoja:</Text>
                <Text>{roomInfo.seats ?? '–'}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text>Tyyppi:</Text>
                <Text>
                  {roomInfo.type === 'wc' ? 'WC' : 'Huone'}
                </Text>
              </View>

              {roomInfo.bookable != null && (
                <View style={styles.detailRow}>
                  <Text>Varauskelpoinen:</Text>
                  <Text>{roomInfo.bookable ? 'Kyllä' : 'Ei'}</Text>
                </View>
              )}

              {roomInfo.equipment && (
                <View style={styles.detailRow}>
                  <Text>Ominaisuudet:</Text>
                  <Text>
                    {Array.isArray(roomInfo.equipment)
                      ? roomInfo.equipment.join(', ')
                      : JSON.stringify(roomInfo.equipment)}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <Text>Valitse huone nähdäksesi tiedot</Text>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

RoomModal.displayName = 'RoomModal';

export default RoomModal;

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
    backgroundColor: '#CCC',
    marginTop: 8,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  carouselContainer: {
    width: '100%',
    height: 200,
    marginBottom: 12,
  },
  carouselImage: {
    width: SCREEN_WIDTH - 32,  // account for padding
    height: 200,
    borderRadius: 8,
    marginRight: 8,
  },
  id: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
  },
});