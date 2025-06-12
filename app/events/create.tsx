import { supabase } from '@/lib/supabase';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapboxGL from '@rnmapbox/maps';
import { Stack } from 'expo-router';
import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Map Picker Bottom Sheet
const MapPickerModal = forwardRef(({ initialLocation, onConfirm, onClose }, ref) => {
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ['96%'], []);
  const [marker, setMarker] = useState(initialLocation || { lat: 37.77, lon: -122.42 });

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    close: () => sheetRef.current?.close(),
  }));

  const handleMapPress = (e) => {
    const [lon, lat] = e.geometry.coordinates;
    setMarker({ lat, lon });
  };

  const handleConfirm = () => {
    onConfirm(marker);
    sheetRef.current?.close();
    onClose && onClose();
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={styles.modalBackground}
      handleIndicatorStyle={styles.handle}
      onDismiss={onClose}
    >
      <BottomSheetView style={styles.mapContainer}>
        <MapboxGL.MapView style={styles.map} onPress={handleMapPress}>
          <MapboxGL.Camera zoomLevel={14} centerCoordinate={[marker.lon, marker.lat]} />
            <MapboxGL.ShapeSource
            id="markerSource"
            shape={{
              type: 'Feature',
              geometry: {
              type: 'Point',
              coordinates: [marker.lon, marker.lat],
              },
            }}
            >
              <MapboxGL.CircleLayer
                id="markerCircle"
                style={{
                circleRadius: 8,
                circleColor: '#FF0000', // Red color for the circle
                circleStrokeWidth: 2,
                circleStrokeColor: '#FFFFFF', // White border for the circle
                }}
              />
            </MapboxGL.ShapeSource>
        </MapboxGL.MapView>
        <Pressable style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Place Pin Here</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

MapPickerModal.displayName = 'MapPickerModal';

const DateTimePickerModal = forwardRef(({ initialDateTime, onConfirm, onClose, label }, ref) => {
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ['80%'], []);
  const [date, setDate] = useState(initialDateTime || new Date());

  useImperativeHandle(ref, () => ({
    present: () => sheetRef.current?.present(),
    close: () => sheetRef.current?.close(),
  }));

  const handleDateChange = (_, selected) => {
    if (selected) {
      setDate(prev => {
        const newDate = new Date(prev);
        newDate.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
        return newDate;
      });
    }
  };
  const handleTimeChange = (_, selected) => {
    if (selected) {
      setDate(prev => {
        const newDate = new Date(prev);
        newDate.setHours(selected.getHours(), selected.getMinutes());
        return newDate;
      });
    }
  };
  const handleConfirm = () => {
    onConfirm(date);
    sheetRef.current?.close();
    onClose && onClose();
  };

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={styles.modalBackground}
      handleIndicatorStyle={styles.handle}
      onDismiss={onClose}
    >
      <BottomSheetView style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Select {label} Date</Text>
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
          onChange={handleDateChange}
          style={styles.picker}
        />
        <Text style={styles.pickerLabel}>Select {label} Time</Text>
        <DateTimePicker
          value={date}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
          style={styles.picker}
        />
        <Pressable style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm {label} Time</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
DateTimePickerModal.displayName = 'DateTimePickerModal';

const CreateEventPage = () => {
  const mapModalRef = useRef(null);
  const startModalRef = useRef(null);
  const endModalRef   = useRef(null);

  const [eventName, setEventName] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime,   setEndDateTime]   = useState(new Date(new Date().getTime() + 2 * 60 * 60 * 1000));
  const [eventLocation, setEventLocation] = useState(null);
  const [eventDescription, setEventDescription] = useState('');

  const openStart = () =>  startModalRef.current?.present();
  const openEnd   = () =>  endModalRef.current?.present();
  const openMap   = () =>  mapModalRef.current?.present();

  const handleSubmit = async () => {
    console.log('Submitting event:', {
      eventName,
      start: startDateTime.toISOString(),
      end:   endDateTime.toISOString(),
      location: eventLocation,
      description: eventDescription,
    });

    const { data: { user } } = await supabase.auth.getUser();

    supabase
      .from('user_events')
      .insert({
        name:        eventName,
        organizer:   user?.id,
        start:       startDateTime.toISOString(),
        end:         endDateTime.toISOString(),
        description: eventDescription,
        lat:         eventLocation?.lat || null,
        lon:         eventLocation?.lon || null,
      })
      .then(({ error }) => {
        if (error) {
          console.error('Error creating event:', error.message);
        } else {
          console.log('Event created successfully!');
          // Reset form
          setEventName('');
          setStartDateTime(new Date());
          setEndDateTime(new Date(new Date().getTime() + 2 * 60 * 60 * 1000));
          setEventLocation(null);
          setEventDescription('');
        }
      });
  };

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ title: 'Create New Event', /* … */ }} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {/* Event Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event Name</Text>
              <TextInput
                style={styles.input}
                value={eventName}
                onChangeText={setEventName}
                placeholder="e.g. Sunday Brunch"
                placeholderTextColor="#999"
              />
            </View>

            {/* Start Date & Time */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Start</Text>
              <Pressable style={styles.input} onPress={openStart}>
                <Text style={styles.inputText}>
                  {startDateTime.toDateString()} @ {startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </Pressable>
            </View>

            {/* End Date & Time */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>End</Text>
              <Pressable style={styles.input} onPress={openEnd}>
                <Text style={styles.inputText}>
                  {endDateTime.toDateString()} @ {endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </Pressable>
            </View>

            {/* Location */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Event Location</Text>
              <Pressable style={styles.input} onPress={openMap}>
                <Text style={styles.inputText}>
                  {eventLocation
                    ? `📍 ${eventLocation.lat.toFixed(4)}, ${eventLocation.lon.toFixed(4)}`
                    : 'Pin on map...'}
                </Text>
              </Pressable>
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={eventDescription}
                onChangeText={setEventDescription}
                placeholder="Tell us more..."
                placeholderTextColor="#999"
                multiline
              />
            </View>

            <Pressable style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Create Event</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Bottom Sheet Modals */}
        <MapPickerModal
          ref={mapModalRef}
          initialLocation={eventLocation}
          onConfirm={setEventLocation}
        />
        <DateTimePickerModal
          ref={startModalRef}
          initialDateTime={startDateTime}
          onConfirm={setStartDateTime}
          label="Start"
        />
        <DateTimePickerModal
          ref={endModalRef}
          initialDateTime={endDateTime}
          onConfirm={setEndDateTime}
          label="End"
        />
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default CreateEventPage;


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F5F2' },
  container: { flex: 1 },
  content: {
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 6, color: '#555' },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  inputText: { color: '#333' },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: {
    marginTop: 10,
    paddingVertical: 14,
    backgroundColor: '#8AB6D6',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  modalBackground: { backgroundColor: '#FFF', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  handle: { width: 40, height: 5, borderRadius: 2.5, backgroundColor: '#ccc', marginVertical: 8 },
  mapContainer: { flex: 1, padding: 10 },
  map: { flex: 1, borderRadius: 8 },
  pickerContainer: { flex: 1, alignItems: 'center', paddingTop: 10 },
  pickerLabel: { fontSize: 16, color: '#555', marginVertical: 6 },
  picker: { width: '90%', backgroundColor: '#FAFAFA', borderRadius: 8, marginBottom: 10 },
  confirmButton: { marginTop: 10, paddingVertical: 12, paddingHorizontal: 8, backgroundColor: '#8AB6D6', borderRadius: 8, alignItems: 'center' },
  confirmText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});