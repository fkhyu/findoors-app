import Loading from '@/components/loading';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EventsScreen = () => {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [shares, setShares] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });
      if (eventsError) console.error(eventsError);
      else setEvents(eventsData || []);

      const { data: sharesData, error: sharesError } = await supabase
        .from('shares')
        .select('*')
        .order('begins', { ascending: true });
      if (sharesError) console.error(sharesError);
      else setShares(sharesData || []);

      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  const renderTextWithLinks = (text: string) =>
    text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
      /(https?:\/\/[^\s]+)/.test(part) ? (
        <Text
          key={i}
          style={styles.link}
          onPress={() => Linking.openURL(part).catch(console.error)}
        >
          {part}
        </Text>
      ) : (
        part
      )
    );

  const goToMap = (poi_id: string) => {
    router.replace(`/?poi=${poi_id}`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.header}>Neighbor Shares</Text>
        {shares.length > 0 ? (
          shares
            .filter(share => {
              const startTime = new Date(share.begins + 'Z');
              const endTime = new Date(startTime.getTime() + share.duration * 60000); 
              return endTime > new Date();
            })
            .map(share => (
            <Pressable
              key={share.id}
              style={styles.card}
              onPress={() => goToMap(share.lat, share.lon)}
            >
              <Text style={styles.name}>{share.title}</Text>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                <Text style={[styles.time, { paddingRight: 8 }]}>
                  {new Date(share.begins + 'Z').toLocaleDateString([], {
                    day: 'numeric',
                    month: 'long',
                  })}
                </Text>
                <Text style={styles.time}>
                  {new Date(share.begins + 'Z').toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </Text>
                <Text style={styles.time}>-</Text>
                <Text style={styles.time}>
                    {new Date(
                      new Date(share.begins + 'Z').getTime() + share.duration * 60000
                      ).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })}
                </Text>
              </View>
              {share.description && (
                <Text style={styles.desc}>
                  {renderTextWithLinks(share.description)}
                </Text>
              )}
            </Pressable>
          ))
        ) : (
          <Text style={styles.no}>No shares found.</Text>
        )}

        <Text style={styles.header}>Upcoming Events</Text>
        {events.length > 0 ? (
          events.map(event => (
            <Pressable
              key={event.id}
              style={styles.card}
              onPress={() => {
                /* if your events table also has lat/lon */
                goToMap(event.poi_id);
              }}
            >
              <Text style={styles.name}>{event.name}</Text>
              <Text style={styles.time}>
                {new Date(event.start_time).toLocaleString([], {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit',
                })} -{' '}
                {new Date(event.end_time).toLocaleString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })}
              </Text>
              <Text style={styles.time}>{event.poi_id}</Text>
              {event.description && (
                <Text style={styles.desc}>
                  {renderTextWithLinks(event.description)}
                </Text>
              )}
            </Pressable>
          ))
        ) : (
          <Text style={styles.no}>No events found.</Text>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default EventsScreen;

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 50 },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  time: { fontSize: 14, color: '#666', marginBottom: 10 },
  desc: { fontSize: 16, color: '#333' },
  link: { color: '#007AFF', textDecorationLine: 'underline' },
  no: { textAlign: 'center', fontSize: 18, color: '#888', marginTop: 30 },
});