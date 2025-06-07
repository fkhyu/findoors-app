import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

export type ShareLocationModalMethods = {
  present: () => void;
  close: () => void;
};

interface Props {
  onSubmit: (data: {
    isPrecise: boolean;
    accuracy: number;
    visibility: 'everyone' | 'friends';
    locationName: string;
    description: string;
    startTime: Date;
    duration: number;
    manualLocation: [number, number] | null;
  }) => void;
  onClose: () => void;
  manualLocation: [number, number] | null;
  setManualLocation: (loc: [number, number] | null) => void;
}

const ShareLocationModal = forwardRef<
  ShareLocationModalMethods,
  Props
>(({ onSubmit, onClose, manualLocation, setManualLocation }, ref) => {
  const sheetRef = useRef<BottomSheetModal>(null);

  // form state
  const [isPrecise, setIsPrecise] = useState(true);
  const [accuracy, setAccuracy] = useState(50);
  const [visibility, setVisibility] = useState<'everyone' | 'friends'>('everyone');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [startNow, setStartNow] = useState(true);
  const [startTime, setStartTime] = useState(new Date());
  const [duration, setDuration] = useState(60);

  // bottom-sheet sizes
  const snapPoints = useMemo(() => ['60%', '90%'], []);

  useImperativeHandle(ref, () => ({
    present: () => {
      sheetRef.current?.present();
      sheetRef.current?.snapToIndex(0);
    },
    close: () => {
      sheetRef.current?.close();
    },
  }));

  const handleSubmit = () => {
    onSubmit({
      isPrecise,
      accuracy,
      visibility,
      locationName,
      description,
      startTime: startNow ? new Date() : startTime,
      duration,
      manualLocation,
    });
    setManualLocation(null);
    onClose();
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
      onDismiss={onClose}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <Text style={styles.header}>Share Your Location</Text>
          <Pressable onPress={() => Keyboard.dismiss()} style={styles.doneButton}>
            <Text style={styles.doneText}>Close Keyboard</Text>
          </Pressable>
        </View>

        <View style={styles.row}>
          <Text>Share Live Location:</Text>
          <Switch value={isPrecise} onValueChange={setIsPrecise} />
        </View>

        {!isPrecise && manualLocation && (
          <View style={styles.row}>
            <Text>
              Chosen coords: {manualLocation[1].toFixed(5)},{' '}
              {manualLocation[0].toFixed(5)}
            </Text>
            <Pressable onPress={() => setManualLocation(null)}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.row}>
          <Text>Accuracy (meters):</Text>
          <Text>{accuracy.toFixed(0)}m</Text>
        </View>
        <Slider
          minimumValue={10}
          maximumValue={1000}
          step={10}
          value={accuracy}
          onValueChange={setAccuracy}
        />

        <View style={styles.row}>
          <Text>Share With:</Text>
          <Pressable onPress={() => setVisibility('everyone')}>
            <Text style={visibility === 'everyone' ? styles.selected : undefined}>
              Everyone
            </Text>
          </Pressable>
          <Pressable onPress={() => setVisibility('friends')}>
            <Text style={visibility === 'friends' ? styles.selected : undefined}>
              Friends Only
            </Text>
          </Pressable>
        </View>

        <View style={styles.inputContainer}>
          <Text>Location Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Cafe Meeting Spot"
            value={locationName}
            onChangeText={setLocationName}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
        </View>

        {/* new */}
        <View style={styles.inputContainer}>
          <Text>Description:</Text>
          <TextInput
            style={styles.input}
            placeholder="Some details…"
            value={description}
            onChangeText={setDescription}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
        </View>

        <View style={styles.row}>
          <Text>Start Now:</Text>
          <Switch value={startNow} onValueChange={setStartNow} />
        </View>
        {!startNow && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => date && setStartTime(date)}
          />
        )}

        <View style={styles.inputContainer}>
          <Text>Duration (minutes):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={duration.toString()}
            onChangeText={text => setDuration(Number(text))}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
        </View>

        <Pressable style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Share Location</Text>
        </Pressable>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

ShareLocationModal.displayName = 'ShareLocationModal';
export default ShareLocationModal;

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
  contentContainer: {
    padding: 20,
    flexGrow: 1,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
  },
  doneButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  doneText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 5,
    borderRadius: 8,
  },
  selected: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginHorizontal: 8,
  },
  clearText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});