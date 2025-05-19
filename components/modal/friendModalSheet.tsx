import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

export type FriendModalMethods = {
  snapToMax: () => void;
  snapToMid: () => void;
  close: () => void;
  present: () => void;
}

type friend = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  floor: number;
}[];

export interface FriendModalProps {
  friend?: friend
  initialSnap?: 'max' | 'mid' | 'min';
  maxHeight?: number;
  midHeight?: number;
  minHeight?: number;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const FriendModal = forwardRef<FriendModalMethods, FriendModalProps>(
  (
    {
      friend,
      initialSnap = 'mid',
      maxHeight = SCREEN_HEIGHT * 0.85,
      midHeight = SCREEN_HEIGHT * 0.5,
      minHeight = SCREEN_HEIGHT * 0,3,
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
          <Text>Friends</Text>
        </BottomSheetView>
      </BottomSheetModal>
    )
  }
)

export default FriendModal;

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
  }
})