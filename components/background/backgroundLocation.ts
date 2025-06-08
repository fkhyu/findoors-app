import * as Location from 'expo-location';

async function startBackgroundLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();

  if (status !== 'granted' || bgStatus !== 'granted') {
    console.log('Permission not granted');
    return;
  }

  const isTaskDefined = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (!isTaskDefined) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 10000, // every 10 seconds
      distanceInterval: 50, // or every 50 meters
      showsBackgroundLocationIndicator: true, // iOS only
      foregroundService: {
        notificationTitle: 'Tracking Location',
        notificationBody: 'Your location is being used in the background',
        notificationColor: '#FF0000',
      },
    });
  }
}