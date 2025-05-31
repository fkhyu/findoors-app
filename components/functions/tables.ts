import { supabase } from "@/lib/supabase";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getRooms = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const cachedRooms = await AsyncStorage.getItem('rooms');
      const cacheTime = await AsyncStorage.getItem('rooms_cache_time');
      const currentTime = Date.now();

      if (cachedRooms && cacheTime && (currentTime - parseInt(cacheTime)) < 15 * 60 * 1000) {
        resolve(JSON.parse(cachedRooms));
      } else {
        const { data, error } = await supabase.from('rooms').select('*');

        if (error) {
          reject(error);
        } else {
          await AsyncStorage.setItem('rooms', JSON.stringify(data));
          await AsyncStorage.setItem('rooms_cache_time', currentTime.toString());
          resolve(data);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}

export const getFloors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const cachedFloors = await AsyncStorage.getItem('floors');
      const cacheTime = await AsyncStorage.getItem('floors_cache_time');
      const currentTime = Date.now();

      if (cachedFloors && cacheTime && (currentTime - parseInt(cacheTime)) < 15 * 60 * 1000) {
        resolve(JSON.parse(cachedFloors));
      } else {
        const { data, error } = await supabase.from('floors').select('*');

        if (error) {
          reject(error);
        } else {
          await AsyncStorage.setItem('floors', JSON.stringify(data));
          await AsyncStorage.setItem('floors_cache_time', currentTime.toString());
          resolve(data);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}

export const getBuildings = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const cachedBuildings = await AsyncStorage.getItem('buildings');
      const cacheTime = await AsyncStorage.getItem('buildings_cache_time');
      const currentTime = Date.now();

      if (cachedBuildings && cacheTime && (currentTime - parseInt(cacheTime)) < 15 * 60 * 1000) {
        resolve(JSON.parse(cachedBuildings));
      } else {
        const { data, error } = await supabase.from('buildings').select('*');

        if (error) {
          reject(error);
        } else {
          await AsyncStorage.setItem('buildings', JSON.stringify(data));
          await AsyncStorage.setItem('buildings_cache_time', currentTime.toString());
          resolve(data);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}

export const getFloorsByBuilding = (buildingId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cachedFloors = await AsyncStorage.getItem(`floors_${buildingId}`);
      const cacheTime = await AsyncStorage.getItem(`floors_cache_time_${buildingId}`);
      const currentTime = Date.now();

      if (cachedFloors && cacheTime && (currentTime - parseInt(cacheTime)) < 15 * 60 * 1000) {
        resolve(JSON.parse(cachedFloors));
      } else {
        const { data, error } = await supabase
          .from('floors')
          .select('*')
          .eq('building_id', buildingId);

        if (error) {
          reject(error);
        } else {
          await AsyncStorage.setItem(`floors_${buildingId}`, JSON.stringify(data));
          await AsyncStorage.setItem(`floors_cache_time_${buildingId}`, currentTime.toString());
          resolve(data);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}

export const getRoomsByFloor = (floorId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Starting to fetch rooms for floor:", floorId);

      const cacheKey = `rooms_for_floor_${floorId}`; // Updated cache key for new logic
      const cacheTimeKey = `rooms_for_floor_cache_time_${floorId}`;

      const cachedRooms = await AsyncStorage.getItem(cacheKey);
      const cacheTime = await AsyncStorage.getItem(cacheTimeKey);
      const currentTime = Date.now();

      console.log("Cached rooms:", cachedRooms);

      if (cachedRooms && cacheTime && (currentTime - parseInt(cacheTime)) < 15 * 60 * 1000) {
        const parsedRooms = JSON.parse(cachedRooms);
        if (Array.isArray(parsedRooms) && parsedRooms.length > 0) {
          resolve(parsedRooms);
          console.log("Returning cached rooms for floor:", floorId);
          return;
        }
     
        // Step 1: Fetch the specific floor to get its rooms_id array.
        // Assumes 'id' is the primary key column in the 'floors' table.
        const { data: floorData, error: floorError } = await supabase
          .from('floors')
          .select('room_ids')
          .eq('id', floorId)
          .single(); // Expecting a single floor record

        console.log (floorData)

        if (floorError) {
          reject(floorError);
          return; // Important: Exit if floor fetch fails
        }

        if (!floorData) { 
          // Floor with the given floorId not found
          await AsyncStorage.setItem(cacheKey, JSON.stringify([]));
          await AsyncStorage.setItem(cacheTimeKey, currentTime.toString());
          resolve([]);
          return; // Important: Exit if floor not found
        }

        const roomIds = floorData.room_ids;

        // Check if roomIds is valid and non-empty before fetching rooms
        if (roomIds && roomIds.length > 0) {
          // Step 2: Fetch rooms from the 'rooms' table where room ID is in the roomIds array.
          // Assumes 'id' is the primary key column in the 'rooms' table.
          const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .in('id', roomIds);

        console.log(roomsData)

          if (roomsError) {
        reject(roomsError);
          } else {
        await AsyncStorage.setItem(cacheKey, JSON.stringify(roomsData || []));
        await AsyncStorage.setItem(cacheTimeKey, currentTime.toString());
        resolve(roomsData || []);
          }
        } else {
          // roomIds is null, undefined, or empty.
          // Floor exists but has no associated room IDs.
          await AsyncStorage.setItem(cacheKey, JSON.stringify([]));
          await AsyncStorage.setItem(cacheTimeKey, currentTime.toString());
          resolve([]);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}