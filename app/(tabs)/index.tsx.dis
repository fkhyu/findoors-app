import { geojson } from "@/assets/geos/map";
import FriendItem from "@/components/friendItem";
import { getCachedGeoJSON } from "@/components/functions/geoJson";
import MapBottomSheet from "@/components/mapBottomSheet";
import { BottomSheetFlatList, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { i18n } from "@lingui/core";
import { t } from '@lingui/macro';
import { Camera, CustomLocationProvider, FillExtrusionLayer, FillLayer, ImageSource, MapView, RasterLayer, setAccessToken, ShapeSource, UserLocation } from '@rnmapbox/maps';
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const geojson3D = geojson;

const eraser = {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          coordinates: [
            [
              [-74.00618, 40.71406],
              [-74.00703, 40.71307],
              [-74.00787, 40.71206],
              [-74.00766, 40.71176],
              [-74.00624, 40.71204],
              [-74.00487, 40.71252],
              [-74.00421, 40.71315],
              [-74.00618, 40.71406]
            ]
          ],
          type: 'Polygon'
        }
      }
    ]
  }
}

i18n.activate('en'); // Default to English

export default function HomeScreen() {
  const styleUrlKey = process.env.EXPO_PUBLIC_MAPTILER_KEY as string

  setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN as string)

  const [geoData, setGeoData] = useState(null);
  const [friends, setFriends] = useState([
    { name: 'Faru Yusupov', id: '1', lat: 60.18394233125424, lon: 24.818510511790645 },
    { name: 'Toivo Kallio', id: '2', lat: 60.18394233125424, lon: 24.818510511790645 },
    { name: 'Wilmer von Harpe', id: '3', lat: 60.18394233125424, lon: 24.818510511790645 },
    { name: 'Maximilian Bergström', id: '4', lat: 60.18394233125424, lon: 24.818510511790645 },
  ]);

  // On mount: try loading from cache
  useEffect(() => {
    (async () => {
      const cached = await getCachedGeoJSON();
      if (cached) setGeoData(cached);
    })();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        style={styles.map}
        styleURL={`https://api.maptiler.com/maps/openstreetmap/style.json?key=XSJRg4GXeLgDiZ98hfVp`}
        compassViewMargins={{ x: 10, y: 40 }}
        pitchEnabled={true}
      >
        <Camera
          centerCoordinate={[24.818510511790645, 60.18394233125424]}
          zoomLevel={16}
          animationDuration={1000}
          pitch={5}
          maxBounds={{
            ne: [24.620221246474574, 59.98446920858392],
            sw: [25.016749575387433, 60.28339638856884]
          }}
          minZoomLevel={9}
        />
        <ShapeSource id="buildingSource" shape={geojson3D}>
          <FillExtrusionLayer
            id="extrusionLayer"
            style={{
              fillExtrusionHeight: 10,
              fillExtrusionBase: 0,
              fillExtrusionColor: '#444444', 
              fillExtrusionOpacity: 0.8,
            }}
          />
          <FillLayer
            id="fill"
            style={{
              fillColor: '#444444',
              fillOpacity: 0.5,
            }}

          />
        </ShapeSource>

        <CustomLocationProvider
          coordinate={[24.18510511790645, 60.18394233125424]}
          heading={0}
        />
        <UserLocation/>
      
        <ImageSource
          id="buildingImage"
          url={require('@/assets/images/floor0.png')}
          coordinates={[
            [
              24.816749575387433,
              60.18420574696768
            ],
            [
              24.816971678842208,
              60.18339638856884
            ],
            [
              24.820221246474574,
              60.18365156256357
            ],
            [
              24.819925082170272,
              60.18446920858392
            ],
          ]}
        />
        <RasterLayer
          id="buildingImageLayer"
          sourceID="buildingImage"
          style={{
            rasterOpacity: 0,
          }}
        />

        
      </MapView>

      
      <MapBottomSheet
        initialSnap="mid"
      >
        <View style={{ flex: 12, backgroundColor: 'white' }}>
          <BottomSheetTextInput
            placeholder={t`Search for Friends`}
            placeholderTextColor="#B5B5B5"
            style={{
              color: '#000',
              height: 48,
              borderRadius: 6, 
              paddingHorizontal: 10,
              margin: 16,
              marginTop: 0,
              backgroundColor: '#F9F9F9',
            }}
          />
          <BottomSheetFlatList 
            data={[{ name: 'Faru Yusupov', id: '1' }, { name: 'Toivo Kallio', id: '2' }, { name: 'Wilmer von Harpe', id: '3' }, { name: 'Maximilian Bergström', id: '4' }]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FriendItem {...item}/>
            )}
            contentContainerStyle={{ paddingBottom: 20, flex: 1, height: '100%' }}
          />
        </View>
      </MapBottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
