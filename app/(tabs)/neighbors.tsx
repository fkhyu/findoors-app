import Loading from '@/components/loading';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface Friend {
  age: number;
  country: string;
  name: string;
  email: string;
  id: string;
}

interface Neighbor {
  friend_id: string;
  id: string;
}

const NeighborsScreen = () => {
  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
  const [friendsData, setFriendsData] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

  const fetchNeighbors = async () => {
    try {
      const { data, error } = await supabase
        .from('friends')
        .select('*');
      if (error) {
        console.error('Error fetching neighbors:', error.message);
      } else {
        setNeighbors(data || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching neighbors:', error);
    }
  };

  useEffect(() => {
    fetchNeighbors();
  }, []);

  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .in('id', neighbors.map(n => n.friend_id))
          .neq('id', currentUserId); 
        if (error) {
          console.error('Error fetching friends data:', error.message);
        } else {
          setFriendsData(data || []);
        }
      } catch (error) {
        console.error('Unexpected error fetching friends data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (neighbors.length > 0 && currentUserId) {
      fetchFriendsData();
    } else {
      setLoading(false);
    }
  }, [neighbors, currentUserId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView style={styles.container}>
      {friendsData.length > 0 ? (
        <View style={styles.friendsList}>
          {friendsData.map((friend) => (
            <View key={friend.id} style={styles.friendCard}>
              <Text style={styles.name}>{friend.name}</Text>
              <Text style={styles.details}>{friend.age} years • {friend.country}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.text}>No neighbors found</Text>
          <Text style={styles.text}>You can add neighbors from top right of the screen</Text>
        </View>
      )}
    </ScrollView>
  ); 
};

export default NeighborsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  friendsList: {
    width: '100%',
    padding: 16,
    flex: 1,
  }, 
  friendCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  details: {
    fontSize: 16,
    color: '#666',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});