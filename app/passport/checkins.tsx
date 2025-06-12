import { supabase } from '@/lib/supabase';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const CheckinsScreen = () => {
  const [checkins, setCheckins] = useState<any[]>([]);

  useEffect(() => {
    const fetchCheckins = async () => {
      const { data, error } = await supabase
        .from('check_ins')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching checkins:', error);
      } else {
        setCheckins(data || []);
      }
    };

    fetchCheckins();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'My Check-ins',
          headerTitleStyle: { fontSize: 24, fontWeight: 'bold' },
          headerStyle: { backgroundColor: '#f8f8f8' },
          headerTintColor: '#333',
        }}
      />
      {checkins.length === 0 ? (
        <Text style={styles.noCheckins}>No check-ins yet.</Text>
      ) : (
        checkins.map((checkin) => (
          <View key={checkin.id} style={styles.checkinCard}>
            <Text style={styles.checkinText}>{checkin.caption}</Text>
            {checkin.image_url && (
              <Image source={{ uri: checkin.image_url }} style={styles.checkinImage} />
            )}
          </View>
        ))
      )}
    </View>
  );
};

export default CheckinsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  noCheckins: {
    fontSize: 16,
    color: '#888',
  },
  checkinCard: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  checkinText: {
    fontSize: 16,
    marginBottom: 8,
  },
  checkinImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});