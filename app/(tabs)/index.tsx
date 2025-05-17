import FriendItem from "@/components/friendItem";
import MapBottomSheet from "@/components/mapBottomSheet";
import { BottomSheetFlatList, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Camera, FillExtrusionLayer, ImageSource, MapView, RasterLayer, ShapeSource, UserLocation, setAccessToken } from '@rnmapbox/maps';
import React from "react";
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const geojson3D = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              24.81741049567501,
              60.18420109071207
            ],
            [
              24.8170223152558,
              60.184169254246704
            ],
            [
              24.81702180028573,
              60.184169185612404
            ],
            [
              24.817021322253517,
              60.18416906823014
            ],
            [
              24.817020899619113,
              60.18416890663278
            ],
            [
              24.817020548703177,
              60.18416870706071
            ],
            [
              24.817020283056873,
              60.18416847722065
            ],
            [
              24.817020112938533,
              60.18416822598829
            ],
            [
              24.81702004491753,
              60.18416796306529
            ],
            [
              24.8170200816206,
              60.18416769860485
            ],
            [
              24.817096811565744,
              60.183941802727
            ],
            [
              24.817096949222275,
              60.18394155002083
            ],
            [
              24.817097182460536,
              60.18394131529525
            ],
            [
              24.817097502495052,
              60.18394110739178
            ],
            [
              24.817097897270973,
              60.18394093414156
            ],
            [
              24.817098351918112,
              60.18394080207049
            ],
            [
              24.817098849311115,
              60.18394071615335
            ],
            [
              24.81709937071449,
              60.183940679626396
            ],
            [
              24.81709989648835,
              60.1839406938655
            ],
            [
              24.817317971008773,
              60.183957259615276
            ],
            [
              24.817317985189124,
              60.183957260711566
            ],
            [
              24.81749668514453,
              60.183971316492915
            ],
            [
              24.81749720674074,
              60.18397138449449
            ],
            [
              24.81749769098702,
              60.18397150244357
            ],
            [
              24.8174981187544,
              60.18397166568081
            ],
            [
              24.81749847314497,
              60.18397186775793
            ],
            [
              24.81749874015939,
              60.18397210069238
            ],
            [
              24.8174989092499,
              60.18397235528264
            ],
            [
              24.817498973736996,
              60.18397262147174
            ],
            [
              24.817498931073256,
              60.183972888744535
            ],
            [
              24.817416675822503,
              60.18419925751339
            ],
            [
              24.81741668836629,
              60.18419926462309
            ],
            [
              24.817416954364507,
              60.18419949362043
            ],
            [
              24.817417125400528,
              60.184199744019864
            ],
            [
              24.81741719490154,
              60.18420000619869
            ],
            [
              24.817417160196655,
              60.18420027008155
            ],
            [
              24.81741702261956,
              60.1842005255275
            ],
            [
              24.817416787457255,
              60.18420076272
            ],
            [
              24.817416463746902,
              60.18420097254379
            ],
            [
              24.81741606392851,
              60.184201146935486
            ],
            [
              24.817415980562334,
              60.18420117087546
            ],
            [
              24.81741210512181,
              60.18421183611752
            ],
            [
              24.817411959715336,
              60.18421209048913
            ],
            [
              24.817411717295613,
              60.18421232586842
            ],
            [
              24.81741138717869,
              60.18421253320989
            ],
            [
              24.81741098205078,
              60.18421270454553
            ],
            [
              24.81741051748072,
              60.184212833291014
            ],
            [
              24.817410011321677,
              60.1842129144987
            ],
            [
              24.817409483025063,
              60.184212945047854
            ],
            [
              24.817408952893018,
              60.18421292376446
            ],
            [
              24.817408441298227,
              60.18421285146647
            ],
            [
              24.81740796790099,
              60.18421273093219
            ],
            [
              24.8174075508937,
              60.18421256679375
            ],
            [
              24.817407206301716,
              60.18421236535885
            ],
            [
              24.817406947367513,
              60.18421213436855
            ],
            [
              24.817406784041783,
              60.184211882699664
            ],
            [
              24.817406722601046,
              60.184211620023696
            ],
            [
              24.817406765406425,
              60.18421135643514
            ],
            [
              24.81741049567501,
              60.18420109071207
            ]
          ],
          [
            [
              24.817411460529158,
              60.184198435426225
            ],
            [
              24.81749309837344,
              60.18397376588499
            ],
            [
              24.81731714444183,
              60.1839599260923
            ],
            [
              24.81710171715317,
              60.18394356143827
            ],
            [
              24.817025885557,
              60.18416681264987
            ],
            [
              24.817411460529158,
              60.184198435426225
            ]
          ]
        ]
      },
      "properties": {
        "type": "wall",
        "width": 0.3,
        "height": 2.5
      }
    }
  ]
};

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

export default function HomeScreen() {
  const styleUrlKey = process.env.EXPO_PUBLIC_MAPTILER_KEY as string

  setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN as string)

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
            rasterOpacity: 0,
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
