import Loading from '@/components/loading';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EventsScreen = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>
      {events.length > 0 ? (
        events.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <Text style={styles.eventName}>{event.name}</Text>
            <Text style={styles.eventTime}>
              {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}
            </Text>
            {event.description && (
              <Text style={styles.eventDescription}>
              {event.description.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
                // Check if the current part is a URL
                if (/(https?:\/\/[^\s]+)/.test(part)) {
                return (
                  <Text
                  key={`link-${index}`}
                  style={{ color: '#007AFF', textDecorationLine: 'underline' }}
                  onPress={() => Linking.openURL(part).catch(err => console.error("Failed to open URL:", err))}
                  >
                  {part}
                  </Text>
                );
                }
                // Otherwise, render it as plain text
                return part;
              })}
              </Text>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noEvents}>No events found.</Text>
      )}
    </ScrollView>
    </SafeAreaView>
  );
};

export default EventsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 16,
    color: '#333',
  },
  noEvents: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 30,
  },
}); 