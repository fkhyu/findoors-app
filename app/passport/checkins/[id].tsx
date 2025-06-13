import { supabase } from '@/lib/supabase';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const FullScreenImageScreen = () => {
  const { id } = useLocalSearchParams();
  const [checkinData, setCheckinData] = useState(null);

  const getCheckinDetails = () => {
    supabase
      .from('check_ins')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching check-in details:', error);
        } else {
          console.log('Check-in details:', data);
          setCheckinData(data);
        }
      });
  }

  useEffect(() => {
    getCheckinDetails();
  }, [id]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Check-in Image',
          headerTitleStyle: { fontSize: 20 },
          headerStyle: { backgroundColor: 'rgba(255, 255, 255, 0.5)' },
          headerTintColor: '#5C4B51'
        }}
      />
      <Image source={{ uri: checkinData?.image_url }} contentFit='contain' style={styles.image}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{checkinData?.caption}</Text>
        </View>
      </Image>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'flex-end', // Aligns children (textContainer) to the bottom
  },
  textContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background for text
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 30, 
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FullScreenImageScreen;