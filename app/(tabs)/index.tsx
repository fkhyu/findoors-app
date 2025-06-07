import { MaterialIcons } from '@expo/vector-icons';
import MapBox, {
  Camera,
  FillLayer,
  MapView,
  MarkerView,
  ShapeSource,
  UserLocation,
} from '@rnmapbox/maps';
import circle from '@turf/circle';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
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

interface LocationShareData {
  isPrecise: boolean;
  accuracy: number;
  visibility: 'everyone' | 'friends';
  locationName: string;
  description: string;
  startTime: Date;
  duration: number;
  manualLocation: [number, number] | null;
}

const SFHomeScreen = () => {
  const router = useRouter();
  const [pois, setPois] = useState<POI[]>([]);
  const [shares, setShares] = useState<any[]>([]);
  const poiModalRef = useRef<POIModalMethods>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const shareModalRef = useRef<ShareLocationModalMethods>(null);
  const filterModalRef = useRef<ShareLocationModalMethods>(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/welcome');
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      const { data: poiData, error: poiError } = await supabase.from<POI>('poi').select('*');
      if (poiError) {
        console.error('Error fetching POIs:', poiError.message);
        setPois([]);
      } else {
        setPois(poiData || []);
      }

      const { data: shareData, error: shareError } = await supabase.from<any>('shares').select('*');
      if (shareError) {
        console.error('Error fetching shares:', shareError.message);
        setShares([]);
      } else {
        setShares(shareData || []);
      }
    })();
  }, []);

  const openPoiModal = (poi: POI) => {
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

  const handleLocationShare = async (data: LocationShareData) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let longitude: number, latitude: number;
    if (data.isPrecise) {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      longitude = loc.coords.longitude;
      latitude  = loc.coords.latitude;
    } else if (data.manualLocation) {
      [longitude, latitude] = data.manualLocation;
    } else {
      alert('Please tap the map to pick a location');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert('Not logged in');
      return; 
    }

    const row = {
      begins:      data.startTime.toISOString(),
      organizer:   user.id,
      duration:    data.duration,
      title:       data.locationName,
      public:      data.visibility === 'everyone',
      description: data.description,
      accuracy:    data.accuracy,
      isPrecise:   data.isPrecise,
      lat:         latitude,
      lon:         longitude,
    };

    const { error } = await supabase.from('shares').insert([row]);
    if (error) {
      console.error('Error sharing location:', error.message);
      alert('Could not share location');
    } else {
      console.log('Location published!');
    }

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

        {shares.map(share => {
          // generate a GeoJSON polygon approximating the accuracy circle
          const polygon = circle(
            [share.lon, share.lat],
            share.accuracy / 1000,        // turf.circle expects kilometers
            { steps: 16, units: 'kilometers' }
          );

          return (
            <React.Fragment key={share.id}>
              {/* fill polygon under the marker */}
              <ShapeSource
                id={`sharePolygonSource-${share.id}`}
                shape={polygon}
              >
                <FillLayer
                  id={`sharePolygonFill-${share.id}`}
                  style={{
                    fillColor: '#007AFF',
                    fillOpacity: 0.15,
                  }}
                />
              </ShapeSource>

              {/* the share marker on top */}
              <MarkerView
                coordinate={[share.lon, share.lat]}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <Pressable
                  onPress={() => {
                    setSelectedPoi({
                      id: share.id,
                      lat: share.lat,
                      lon: share.lon,
                      title: share.title,
                      icon_url: '',
                      type: 'share',
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