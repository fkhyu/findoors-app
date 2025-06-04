import Loading from '@/components/loading';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const NeighborsScreen = () => {
  const [ neighbors, setNeighbors ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  const fetchNeighbors = async () => {
    try {
      const { data, error } = await supabase
        .from('friends')
        .select('*');
      if (error) {
        console.error('Error fetching neighbors:', error.message);
      } else {
        console.log('Neighbors data:', data);
        setNeighbors(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Unexpected error fetching neighbors:', error);
    }
  };

  useEffect(() => {
    fetchNeighbors();
  }, []);

  if (loading) { 
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      {neighbors.length > 0 ? (
        neighbors.map((neighbor, index) => (
          <Text key={index} style={styles.text}>
            {neighbor.friend_id}
          </Text>
        ))
      ) : (
        <View style={styles.container}>
          <Text style={styles.text}>No neighbors found</Text>
          <Text style={styles.text}>You can add neighbors from top right of the screen</Text>
        </View>
      )}
    </View>
  );
};

export default NeighborsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});