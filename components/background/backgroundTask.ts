import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'BACKGROUND_LOCATION_TASK';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error('Location task error:', error);
    return;
  }

  if (data) {
    const { locations } = data;
    console.log('Received locations:', locations);
  }
} )

export async function startBackgroundLocation() {
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

export async function stopBackgroundLocation() {
  const isRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  if (isRunning) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    console.log('Background location stopped');
  }
}
