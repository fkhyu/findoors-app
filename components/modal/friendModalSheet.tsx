import { supabase } from '@/lib/supabase';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

export type FriendModalMethods = {
  snapToMax: () => void;
  snapToMid: () => void;
  close: () => void;
  present: () => void;
};

export interface FriendModalProps {
  /** The LocationShare object for another user */
  share?: {
    id: string;
    start: string;
    sharer_id: string;
    durationh: number;
    note: string | null;
    isPrecise: boolean;
    lat: number;
    lon: number;
    radius: number;
    shared_to: string[];
    user_name: string | null;
  };
  initialSnap?: 'max' | 'mid' | 'min';
  maxHeight?: number;
  midHeight?: number;
  minHeight?: number;
}

interface UserProfile {
  id: string;
  name: string;
  age: number;
  country: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const FriendModal = forwardRef<FriendModalMethods, FriendModalProps>(
  (
    {
      share,
      initialSnap = 'mid',
      maxHeight = SCREEN_HEIGHT * 0.85,
      midHeight = SCREEN_HEIGHT * 0.5,
      minHeight = SCREEN_HEIGHT * 0.3,
    },
    ref
  ) => {
    const sheetRef = useRef<BottomSheetModal>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    const snapPoints = useMemo(
      () => [
        `${Math.round((minHeight / SCREEN_HEIGHT) * 100)}%`,
        `${Math.round((midHeight / SCREEN_HEIGHT) * 100)}%`,
        `${Math.round((maxHeight / SCREEN_HEIGHT) * 100)}%`,
      ],
      [minHeight, midHeight, maxHeight]
    );

    const initialIndex = useMemo(() => {
      if (initialSnap === 'max') return 2;
      if (initialSnap === 'mid') return 1;
      return 0;
    }, [initialSnap]);

    // Allow present() even if `share` is temporarily undefined
    const handlePresent = useCallback(() => {
      sheetRef.current?.present();
      sheetRef.current?.snapToIndex(initialIndex);
    }, [initialIndex]);

    useImperativeHandle(ref, () => ({
      present: handlePresent,
      snapToMid: () => sheetRef.current?.snapToIndex(1)!,  
      snapToMax: () => sheetRef.current?.snapToIndex(2)!,
      close: () => sheetRef.current?.close()!,
    }));

    // Auto-open when `share` changes
    useEffect(() => {
      if (share) {
        handlePresent();
      }
    }, [share, handlePresent]);

    // Fetch sharer profile when available
    useEffect(() => {
      if (!share) return;
      (async () => {
        const { data, error } = await supabase
          .from<UserProfile>('users')
          .select('id, name, age, country')
          .eq('id', share.sharer_id)
          .single();
        if (error) {
          console.error('Profile fetch error:', error);
        } else {
          setProfile(data);
        }
      })();
    }, [share]);

    // Compute end time and labels
    const endTime = share
      ? dayjs(share.start).add(share.durationh, 'hour')
      : null;
    const precisionLabel = share?.isPrecise
      ? 'Precise location'
      : 'Approximate location';

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
          {/* Title or placeholder */}
          <Text style={styles.title}>
            {share
              ? `Shared by ${profile?.name ?? share.user_name ?? 'Unknown'}`
              : 'No data'}
          </Text>

          {share ? (
            <ScrollView>
              {profile && (
                <View style={styles.row}>
                  <Text style={styles.label}>Age:</Text>
                  <Text style={styles.value}>{profile.age}</Text>
                </View>
              )}

              {profile && (
                <View style={styles.row}>
                  <Text style={styles.label}>Country:</Text>
                  <Text style={styles.value}>{profile.country}</Text>
                </View>
              )}

              <View style={styles.row}>
                <Text style={styles.label}>Started:</Text>
                <Text style={styles.value}>
                  {dayjs(share.start).format('MMM D, YYYY h:mm A')}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Ends:</Text>
                <Text style={styles.value}>
                  {endTime?.format('MMM D, YYYY h:mm A')}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Mode:</Text>
                <Text style={styles.value}>{precisionLabel}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Radius:</Text>
                <Text style={styles.value}>{share.radius} m</Text>
              </View>

              {share.note && (
                <View style={styles.row}>
                  <Text style={styles.label}>Note:</Text>
                  <Text style={styles.value}>{share.note}</Text>
                </View>
              )}
            </ScrollView>
          ) : (
            <View style={styles.placeholder}>
              <Text>No share selected yet.</Text>
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

FriendModal.displayName = 'FriendModal';
export default FriendModal;

const styles = StyleSheet.create({
  background: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  handle: { width: 40, height: 5, borderRadius: 2.5, backgroundColor: '#ccc', marginVertical: 8 },
  content: { padding: 16, flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  row: { flexDirection: 'row', marginBottom: 10 },
  label: { fontWeight: '600', width: 80 },
  value: { flex: 1 },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});