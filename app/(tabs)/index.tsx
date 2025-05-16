import FriendItem from "@/components/friendItem";
import MapBottomSheet from "@/components/mapBottomSheet";
import { BottomSheetFlatList, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Camera, FillExtrusionLayer, ImageSource, MapView, RasterLayer, ShapeSource, UserLocation } from '@rnmapbox/maps';
import React from "react";
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const geojson3D = {
  type: "FeatureCollection",
  features: {
  "type": "FeatureCollection",
  "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "coordinates": [
            [
              24.817043095307866,
              60.18416231370017
            ],
            [
              24.817421436928754,
              60.18419482767786
            ],
            [
              24.817413829368178,
              60.18420920147415
            ],
            [
              24.818194364728498,
              60.18427728779048
            ],
            [
              24.8182095798428,
              60.184230383898864
            ],
            [
              24.818258268207927,
              60.18423567950279
            ],
            [
              24.818270440299187,
              60.184197853740955
            ]
          ],
          "type": "LineString"
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "coordinates": [
            [
              24.817027249408852,
              60.184165838585955
            ],
            [
              24.817414160129545,
              60.18419720444061
            ],
            [
              24.817409954577982,
              60.184218114993456
            ],
            [
              24.81820059822448,
              60.184282937623266
            ],
            [
              24.81821742042959,
              60.18423275237265
            ],
            [
              24.818272092596374,
              60.184241116586605
            ],
            [
              24.818284709251174,
              60.18419929549634
            ],
            [
              24.818604331150283,
              60.184226479211134
            ],
            [
              24.81858330339358,
              60.18430175707246
            ],
            [
              24.81880199206219,
              60.1843205765108
            ],
            [
              24.818835636472386,
              60.184226479211134
            ],
            [
              24.8189113363959,
              60.18423275237265
            ],
            [
              24.818928158600983,
              60.18417420281699
            ],
            [
              24.819685157837313,
              60.184243207639554
            ],
            [
              24.81982394103082,
              60.18380408356552
            ],
            [
              24.819966929774665,
              60.183812447888386
            ],
            [
              24.81998795753134,
              60.18372671347723
            ],
            [
              24.817801070850237,
              60.1835447884977
            ],
            [
              24.817775837542,
              60.18363888775093
            ],
            [
              24.817594998836398,
              60.18367861846593
            ],
            [
              24.8174435989894,
              60.183668163019234
            ],
            [
              24.81738472127094,
              60.18386472485881
            ],
            [
              24.817023043858484,
              60.18383544976575
            ],
            [
              24.816985193895476,
              60.18393791247692
            ],
            [
              24.817107154883928,
              60.1839483678377
            ],
            [
              24.817031454960414,
              60.18417211175938
            ]
          ],
          "type": "LineString"
        }
      }
    ]
  }
};


export default function HomeScreen() {
  const styleUrlKey = process.env.EXPO_PUBLIC_MAPTILER_KEY as string

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        style={styles.map}
        styleURL={`https://api.maptiler.com/maps/streets-v2/style.json?key=XSJRg4GXeLgDiZ98hfVp`}
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
              fillExtrusionHeight: 8,
              fillExtrusionBase: 0,
              fillExtrusionColor: '#FF6347', 
              fillExtrusionOpacity: 0.7,
            }}
          />
        </ShapeSource>
        <UserLocation
          showsUserHeadingIndicator={false}
        />

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
            rasterOpacity: 1,
          }}
        />
      </MapView>

      <MapBottomSheet
        initialSnap="mid"
      >
        <View style={{ flex: 12, backgroundColor: 'white' }}>
          <BottomSheetTextInput
            placeholder="Hae kaverisi tai paikka"
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
            data={[{ name: 'Friend 1', id: '1' }, { name: 'Friend 2', id: '2' }, { name: 'Friend 3', id: '3' }]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FriendItem {...item}/>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
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
