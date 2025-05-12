import FriendItem from "@/components/friendItem";
import MapBottomSheet from "@/components/mapBottomSheet";
import { BottomSheetFlatList, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Camera, FillLayer, MapView, ShapeSource, UserLocation } from "@maplibre/maplibre-react-native";
import React from "react";
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function HomeScreen() {
  const polygonGeoJSON = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [24.81704359999884, 60.184162812284086],
              [24.817113760987667, 60.18394118910962],
              [24.816985820362845, 60.183930928741205],
              [24.81702709153126, 60.18383448112189],
              [24.81739440493925, 60.18386731438585],
              [24.817464565926883, 60.18367031430961],
              [24.817774099697658, 60.183696991472345],
              [24.81782362510046, 60.18355744915007],
              [24.81998210725925, 60.18373392904664],
              [24.81995321744003, 60.183811908233935],
              [24.819825276815237, 60.18380369990692],
              [24.819668446371253, 60.18424079045252],
              [24.81891731108888, 60.18417717669749],
              [24.818900802621243, 60.18423258223305],
              [24.81883476874964, 60.1842305301777],
              [24.81880587893167, 60.18431261228611],
              [24.818578887500024, 60.184294143829675],
              [24.81860777731808, 60.18422232195567],
              [24.818265226613278, 60.184197697276915],
              [24.81825697237886, 60.18423668634301],
              [24.818215701209255, 60.184234634287975],
              [24.818203319858867, 60.184269519204804],
              [24.81704359999884, 60.184162812284086]
            ]
          ]
        }
      }
    ]
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        style={styles.map}
        mapStyle="https://api.maptiler.com/maps/openstreetmap/style.json?key=KWuj8x5BEIPKrWM4B9xN"
        compassViewMargins={{ x: 10, y: 40 }}
      >
        <Camera
          centerCoordinate={[24.818510511790645, 60.18394233125424]}
          zoomLevel={16}
          animationDuration={1000}
        />
        <ShapeSource id="polygonSource" shape={polygonGeoJSON} onPress={() => console.log("Polygon pressed")}>
          <FillLayer
            id="polygonFill"
            style={{
              fillColor: '#0080ff',
              fillOpacity: 1,
            }}
          />
        </ShapeSource>
        <UserLocation
          showsUserHeadingIndicator={false}
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
