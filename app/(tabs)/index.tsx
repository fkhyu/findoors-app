import { MaterialIcons } from '@expo/vector-icons';
import MapBox, {
  Camera,
  MapView,
  MarkerView,
  UserLocation
} from '@rnmapbox/maps';
import * as Location from 'expo-location';
import { useFocusEffect, useGlobalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import POIModal, { POIModalMethods } from '@/components/modal/poiModal';
import ShareLocationModal, {
  ShareLocationModalMethods,
} from '@/components/modal/shareLocationModal';
import { supabase } from '@/lib/supabase';

interface POI {
  id: string;
  lat: number;
  lon: number;
  title: string;
  icon_url: string;
  type: string;
}

const SFHomeScreen = () => {
  const router = useRouter();
  const [pois, setPois] = useState<POI[]>([]);
  const [shares, setShares] = useState<any[]>([]);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const poiModalRef = useRef<POIModalMethods>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const shareModalRef = useRef<ShareLocationModalMethods>(null);
  const filterModalRef = useRef<ShareLocationModalMethods>(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const cameraRef = useRef<Camera>(null);
  const { poi: poiId } = useGlobalSearchParams<{ poi?: string }>();

  useFocusEffect(
    React.useCallback(() => {
      if (!mapReady || !poiId || pois.length === 0) return;
      const target = pois.find(p => p.id === poiId);
      if (target) {
        cameraRef.current?.flyTo([target.lon, target.lat], 1000);
        setSelectedPoi(target);
        poiModalRef.current?.present();

        // clear the query-param so on refresh it won't trigger again
        router.replace('/'); 
      }
    }, [mapReady, poiId, pois])
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/welcome');
      }
    });
  }, []);

  useEffect(() => {
    console.log('POI ID from params:', poiId);
    if (!poiId || pois.length === 0) return;

    const targetPoi = pois.find(p => p.id === poiId);
    console.log(`Trying to center on POI "${poiId}". Found:`, !!targetPoi);
    // poi lat lon
    console.log('Target POI coordinates:', targetPoi ? `(${targetPoi.lon}, ${targetPoi.lat})` : 'Not found');

    if (targetPoi) {
      cameraRef.current?.flyTo([targetPoi.lon, targetPoi.lat], 1000);
      setSelectedPoi(pois.find(p => p.id === poiId) || null);
      poiModalRef.current?.present();
    }
  }, [poiId, pois]);

  const fetchData = async () => {
    const { data: poiData, error: poiError } = await supabase.from('poi').select('*');
    if (poiError) {
      console.error('Error fetching POIs:', poiError.message);
      setPois([]);
    } else {
      setPois(poiData as POI[] || []);
    }

    const { data: shareData, error: shareError } = await supabase.from('user_events').select('*');
    if (shareError) {
      console.error('Error fetching shares:', shareError.message);
      setUserEvents([]);
    } else {
      setUserEvents(shareData || []);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openPoiModal = (poi: POI) => {
    cameraRef.current?.flyTo([poi.lon, poi.lat], 1000);
    setSelectedPoi(poi);
    poiModalRef.current?.present();
  }; 

  const centerOnUser = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    cameraRef.current?.moveTo([loc.coords.longitude, loc.coords.latitude], 1000);
  };

  const handleLocationShare = async (data: any) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let longitude: number, latitude: number;

    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
    longitude = loc.coords.longitude;
    latitude  = loc.coords.latitude;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert('Not logged in');
      return;
    }

    const row = {
      start:       new Date().toISOString(),
      sharer_id:   user.id,
      durationh:   data.durationHours,
      note:        data.description,
      isPrecise:   data.isPrecise,
      lat:         latitude,
      lon:         longitude,
      radius:      data.radiusMeters, 
      shared_to:   data.friendUserIds
    };

    const { error } = await supabase.from('location_share').insert([row]);
    if (error) {
      console.error('Error sharing location:', error.message);
      alert('Could not share location');
    } else {
      console.log('Location published!');
      alert('Location shared successfully!');
    }

    fetchData();

    setIsSelectingLocation(false);
    setSelectedLocation(null);
  };

  MapBox.setAccessToken(
    'sk.eyJ1Ijoib25yZWMiLCJhIjoiY21hcjk0dWJxMDljZjJpc2ZpNTBmYzJlaSJ9.g9Gtb_MLi1v916-lt7ZrWg'
  );

  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1, width: '100%' }}
        styleURL="https://api.maptiler.com/maps/basic-v2/style.json?key=XSJRg4GXeLgDiZ98hfVp"
        onDidFinishLoadingMap={() => setMapReady(true)}
        onPress={e => {
          if (isSelectingLocation && e.geometry?.coordinates) {
            setSelectedLocation(e.geometry.coordinates as [number, number]);
          }
        }}
      >
        <Camera
          ref={cameraRef}
          zoomLevel={12}
          centerCoordinate={[-122.4194, 37.7749]}
          animationMode="flyTo"
          animationDuration={1000}
        />
        <UserLocation visible androidRenderMode="normal" />

        {pois.map(poi => (
          <MarkerView
            key={poi.id}
            coordinate={[poi.lon, poi.lat]}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <Pressable onPress={() => openPoiModal(poi)} hitSlop={15}>
              <Image
                source={
                  poi.type === 'landmark'
                    ? require('@/assets/landmark64.png')
                    : poi.type === 'food'
                    ? require('@/assets/food64.png')
                    : poi.type === 'gem'
                    ? require('@/assets/gem64.png')
                    : poi.type === 'view'
                    ? require('@/assets/view64.png')
                    : poi.type === 'event'
                    ? require('@/assets/event64.png')
                    : undefined
                }
                style={{ width: 30, height: 30 }}
              />
            </Pressable>
          </MarkerView>
        ))}

        {userEvents
          .filter(event => {
            const endTime = new Date(event.end + 'Z'); 
            return endTime > new Date();
          })
          .map(event => {
            return (
              <React.Fragment key={event.id}>
          <MarkerView
            coordinate={[event.lon, event.lat]}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <Pressable
              onPress={() => {
                setSelectedPoi({
                  id: event.id,
                  lat: event.lat,
                  lon: event.lon,
                  title: event.name,
                  icon_url: '',
                  type: 'uevent',
                });
                poiModalRef.current?.present();
              }}
              hitSlop={15}
            >
              <Image
                source={require('@/assets/share64.png')}
                style={{ width: 30, height: 30 }}
              />
            </Pressable>
          </MarkerView>
              </React.Fragment>
            );
          })}

        {isSelectingLocation && selectedLocation && (
          <MarkerView
            coordinate={selectedLocation}
            anchor={{ x: 0.5, y: 1 }}
          >
            <MaterialIcons name="location-on" size={32} color="red" />
          </MarkerView>
        )}
      </MapView>

      <View style={styles.mapButtonContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.mapButton,
            { opacity: pressed ? 0.6 : 1 },
          ]}
          onPress={centerOnUser}
        >
          <MaterialIcons name="my-location" size={28} color="black" />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.mapButton,
            { opacity: pressed ? 0.6 : 1 },
          ]}
          onPress={() => {
            setIsSelectingLocation(true);
            poiModalRef.current?.close();
            shareModalRef.current?.present();
          }}
        >
          <MaterialIcons name="share-location" size={28} color="black" />
        </Pressable>

      </View>

      <ShareLocationModal
        ref={shareModalRef}
        onSubmit={handleLocationShare}
        onClose={() => setIsSelectingLocation(false)}
        manualLocation={selectedLocation}
        setManualLocation={setSelectedLocation}
      />

      <POIModal
        ref={poiModalRef}
        initialSnap="mid"
        minHeight={200}
        midHeight={400}
        maxHeight={600}
        selectedPoiData={selectedPoi}
      />
    </View>
  );
};

export default SFHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapButtonContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  mapButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
  },
});