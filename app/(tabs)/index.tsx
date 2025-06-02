import POIModal, { POIModalMethods } from '@/components/modal/poiModal';
import { supabase } from '@/lib/supabase';
import { Camera, MapView, MarkerView } from '@rnmapbox/maps';
import React, { useEffect, useRef, useState } from 'react'; // Import useRef and useState
import { Image, Pressable, StyleSheet, View } from 'react-native';

interface POI {
  id: string; // Corrected from Text to string
  lat: number;
  lon: number;
  title: string;
  icon_url: string;
  // Add any other properties your POI object might have
}

const SFHomeScreen = () => {
  const [pois, setPois] = React.useState<POI[]>([]);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null); // State for selected POI
  const poiModalRef = useRef<POIModalMethods>(null); // Ref for POIModal

  useEffect(() => {
    const fetchPois = async () => {
      const { data, error } = await supabase
        .from('poi') // Ensure 'POI' is the correct table name
        .select('*') // Added id for key prop, adjust if not present

      if (error) {
        console.error('Error fetching POIs:', error.message);
        setPois([]); // Set to empty array on error
      } else {
        setPois(data || []); // Set to fetched data or empty array if data is null
      }
    };
 
    fetchPois();
  }, []);

  const openPoiModal = (poi: POI) => {
    setSelectedPoi(poi); // Set the selected POI
    poiModalRef.current?.present(); // Open the modal 
  };

  return (
    <View style={styles.container}> 
      <MapView
        style={{ flex: 1, width: '100%' }}
        styleURL={`https://api.maptiler.com/maps/streets-v2/style.json?key=XSJRg4GXeLgDiZ98hfVp`}
      > 
        <Camera
          zoomLevel={12}
          centerCoordinate={[-122.4194, 37.7749]} // San Francisco coordinates
          animationMode="flyTo"
          animationDuration={1000}
        />
        {pois.map((poi, index) => (
            <MarkerView
            key={index} // Use index as key
            coordinate={[poi.lon, poi.lat]}
            anchor={{ x: 0.5, y: 0.5 }}
            >
            <Pressable onPress={() => openPoiModal(poi)} hitSlop={15}>
            <Image
              source={require('@/assets/sight64.png')}
              style={{ width: 30, height: 30 }}
            />
            </Pressable>
            </MarkerView>
        ))}
      </MapView>
      <POIModal
        initialSnap="mid"
        maxHeight={600}
        midHeight={400}
        minHeight={200}
        ref={poiModalRef} // Assign the ref
        selectedPoiData={selectedPoi} // Pass selected POI data
      />
    </View>  
  ) 
}

export default SFHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});