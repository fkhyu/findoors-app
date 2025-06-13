import POIModal, { POIModalMethods } from '@/components/modal/poiModal';
import ShareLocationModal, {
  ShareLocationModalMethods,
} from '@/components/modal/shareLocationModal';
import { startBackgroundLocation, stopBackgroundLocation } from '@/lib/bg/backgroundLocation';
import { supabase } from '@/lib/supabase';
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
  const [locationShares, setLocationShares] = useState<any[]>([]);
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
  const [shareRowId, setShareRowId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

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

    const { data: locationShareData, error: LSError } = await supabase.from("location_share").select('*');
    if (LSError) {
      console.error('Error fetching locations:', LSError.message)
      setLocationShares([])
    } else {
      console.log('Fetched location shares:', locationShareData);
      setLocationShares(locationShareData)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openPoiModal = (poi: POI) => {
    cameraRef.current?.flyTo([poi.lon, poi.lat], 250);
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

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    if (!shareRowId) return;  // nothing to update yet

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 10000, 
          distanceInterval: 5,
        },
        async loc => {
          // push the update 
          const { error } = await supabase
            .from('location_share')
            .update({
              lat:  loc.coords.latitude,
              lon:  loc.coords.longitude,
            })
            .eq('id', shareRowId);

          if (error) {
            console.error('Error updating location share:', error.message);
          } else {
            console.log('Location updated on server');
          }
        }
      );
    })();

    return () => {
      subscription?.remove();
    };
  }, [shareRowId]);

  const handleLocationShare = async (data: any) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      alert('Not logged in');
      return;
    }

    const row = {
      start:     new Date().toISOString(),
      sharer_id: user.id,
      durationh: data.durationHours,
      note:      data.description,
      isPrecise: data.isPrecise,
      lat:       loc.coords.latitude,
      lon:       loc.coords.longitude,
      radius:    data.radiusMeters,
      shared_to: data.friendUserIds,
    };

    const insertRes = await supabase
      .from('location_share')
      .insert([row])
      .select('id')
      .single();

    if (insertRes.error || !insertRes.data?.id) {
      console.error('Error sharing location:', insertRes.error?.message);
      alert('Could not share location');
      return;
    }

    const newId = insertRes.data.id;
    alert('Location shared successfully!');
    setShareRowId(newId);

    try {
      await startBackgroundLocation(newId);
    } catch (err) {
      console.error('Background tracking failed:', err);
    }

    setTimeout(
      () => stopBackgroundLocation(),
      data.durationHours * 3600 * 1000
    );
    fetchData();
    setIsSelectingLocation(false);
    setSelectedLocation(null);
  };

  useEffect(() => {
    const subscription = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages',
          /*filter: `thingy_id=eq.${selectedPoi?.id}`*/ },
        payload => {
          console.log('New message received:', payload.new);
          setMessages((msgs) => [...msgs, payload.new]);
        }
      )
      .subscribe();

    console.log('Subscribed to messages for POI:', selectedPoi?.id);

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [selectedPoi]);

  // request old messages when a POI is selected
  useEffect(() => {
    if (!selectedPoi) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('thingy_id', selectedPoi.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching messages:', error.message);
      } else {
        console.log('Fetched messages for POI:', selectedPoi.id, data);
        setMessages(data || []);
      }
    };

    fetchMessages();
  }, [selectedPoi]);

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

        {locationShares.map(share => {
          return (
            <MarkerView
            key={share.id}
            coordinate={[share.lon, share.lat]}
            anchor={{ x: 0.5, y: 0.5 }}
            >
              <View>
              <Image
                source={{ uri: `https://ui-avatars.com/api/?name=${share.user_name || 'Anonymous'}&background=random&size=60` }}
                style={{ width: 30, height: 30, borderRadius: 15 }}
              />
              </View>
            </MarkerView>
          )
        })}

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
        maxHeight={800}
        selectedPoiData={selectedPoi}
        messages={messages}
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