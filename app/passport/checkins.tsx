import { supabase } from '@/lib/supabase';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const CheckinsScreen = () => {
  const [checkins, setCheckins] = useState<any[]>([]);
  const [pois, setPois] = useState<any[]>([]);
  const [taggedUsernames, setTaggedUsernames] = useState<any[]>([]);

  useEffect(() => {
    const fetchCheckins = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error('User not found');
        return;
      }

      const { data, error } = await supabase
        .from('check_ins')
        .select('*')
        .eq('poster_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching checkins:', error);
      } else {
        setCheckins(data || []);
      }
    };

    fetchCheckins();
  }, []);

  useEffect(() => {
    const fetchUsernames = async () => {
      console.log('Fetching usernames for checkins:', checkins);

      const { data, error } = await supabase
        .from('users')
        .select('id, name')
        .in('id', checkins.map(checkin => checkin.tagged_ids).flat());

      if (error) {
        console.error('Error fetching usernames:', error);
      } else {
        setTaggedUsernames(data || []);
      }
    };

    if (checkins.length > 0) {
      fetchUsernames();
    }
  }, [checkins]);

  useEffect(() => {
    const fetchPOIs = async () => {
      const { data, error } = await supabase
        .from('poi')
        .select('*')
        .in('id', checkins.map(checkin => checkin.thingy_id));

      if (error) {
        console.error('Error fetching POIs:', error);
      } else {
        setPois(data || []);
      }
    };

    if (checkins.length > 0) {
      fetchPOIs();
    }
  }, [checkins]);

  return (
    <ScrollView style={styles.container}>
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
          <Pressable key={checkin.id} style={styles.checkinCard} onPress={() => {router.push(`/passport/checkins/${checkin.id}`)}}>
          <Text style={styles.checkinText}>"{checkin.caption}"</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {checkin.tagged_ids.length > 0 && (
              <Text>
                w/ {checkin.tagged_ids.map(id => {
                  const user = taggedUsernames.find(user => user.id === id);
                  return user ? user.name : 'Unknown User';
                }).join(', ')}
              </Text>
            )}
            {checkin.thingy_id && <Text> @ {pois.find(poi => poi.id === checkin.thingy_id)?.title}</Text>}
          </View>
          {checkin.image_url && (
            <Image source={{ uri: checkin.image_url }} style={styles.checkinImage} />
          )}
          </Pressable>
        )) 
      )}
    </ScrollView>
  );
};

export default CheckinsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom: 60,
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
    marginTop: 8,
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'cover',
  },
});