import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const EventsScreen = () => {
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*');
      setItems(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.text}>Events Screen</Text>
      {Object.keys(items).length > 0 ? (
        Object.entries(items).map(([key, value]) => (
          <Text key={key} style={styles.text}>
            {key}: {JSON.stringify(value)}
          </Text>
        ))
      ) : (
        <Text style={styles.text}>No events found.</Text>
      )} 
    </View>
  );
}

export default EventsScreen;

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});
