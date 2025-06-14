// lib/backgroundLocation.ts
import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';

const TASK_NAME = 'BACKGROUND_LOCATION_TASK';
const STORAGE_KEY = 'CURRENT_SHARE_ID';
const STORAGE_LAST_TS  = 'LAST_LOC_UPDATE';

///////////////////////
// Task definition  //
///////////////////////

TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('[BG] task error:', error);
    return;
  }
  if (!data) return;

  const { locations } = data as any;
  const { latitude, longitude } = locations[0].coords;

  // Throttle to once per 10s:
  const now = Date.now();
  const lastTs = Number(await AsyncStorage.getItem(STORAGE_LAST_TS) || '0');
  if (now - lastTs < 10_000) {
    return;
  }
  await AsyncStorage.setItem(STORAGE_LAST_TS, now.toString());

  // 1) Update Supabase
  const shareRowId = await AsyncStorage.getItem(STORAGE_KEY);
  if (shareRowId) {
    const { error: supaErr } = await supabase
      .from('location_share')
      .update({ lat: latitude, lon: longitude })
      .eq('id', shareRowId);
    if (supaErr) console.error('[BG] supabase update failed:', supaErr);
  }
});

///////////////////////
// Public API       //
///////////////////////

/**
 * Call after inserting your location_share row.
 */
export async function startBackgroundLocation(shareRowId: string) {
  // Persist the row ID for the task to read 
  await AsyncStorage.setItem(STORAGE_KEY, shareRowId);
  await AsyncStorage.removeItem(STORAGE_LAST_TS);

  // Send one notification to tell the user tracking is active
  const notifId = await Notifications.scheduleNotificationAsync({
    content: {
      title: '📍 Location sharing active',
      body:  'Your location will be updated every 10 seconds.',
    },
    trigger: null,
  });
  // Store that so we can clear it later
  await AsyncStorage.setItem('TRACKING_NOTIF_ID', notifId);

  // Start background updates
  await Location.startLocationUpdatesAsync(TASK_NAME, {
    accuracy:                   Location.Accuracy.Highest,
    timeInterval:               10_000,
    distanceInterval:           0,
    pausesUpdatesAutomatically: false,
    foregroundService: {
      notificationTitle: '🗺️ Sharing your location', 
      notificationBody:  'Tap to open the app',
    },
  }); 
}

/**
 * Call to stop tracking (e.g. when the share expires).
 */
export async function stopBackgroundLocation() {
  // Stop the background task
  await Location.stopLocationUpdatesAsync(TASK_NAME);

  // Clear stored IDs
  const notifId = await AsyncStorage.getItem('TRACKING_NOTIF_ID');
  if (notifId) {
    await Notifications.cancelScheduledNotificationAsync(notifId);
    await AsyncStorage.removeItem('TRACKING_NOTIF_ID');
  }
  await AsyncStorage.removeItem(STORAGE_KEY);
  await AsyncStorage.removeItem(STORAGE_LAST_TS);
}