import { supabase } from '@/lib/supabase';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Checkin = {
  id: string;
  caption: string;
  image_url: string | null;
  created_at: string;
  posterId: string;
  tagged_ids: string[];
  thingy_id: string | null;
};

type User = { id: string; name: string };
type POI = { id: string; title: string };

function useCheckins(mode: 'my' | 'tagged') {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) {
        setError('Not signed in');
        setLoading(false);
        return;
      }

      let q = supabase
        .from<Checkin>('check_ins')
        .select('*')
        .order('created_at', { ascending: false });

      if (mode === 'my') {
        q = q.eq('poster_id', user.id);
      } else {
        q = q.contains('tagged_ids', [user.id]);
      }

      const { data: checkins, error: ciErr } = await q;
      if (!active) return;

      if (ciErr) {
        setError(ciErr.message);
        setLoading(false);
        return;
      }
      if (!checkins || checkins.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      const userIdSet = new Set<string>();
      checkins.forEach(ci => {
        userIdSet.add(ci.poster_id);
        ci.tagged_ids.forEach(id => userIdSet.add(id));
      });
      const allUserIds = Array.from(userIdSet);

      const { data: users, error: uErr } = await supabase
        .from<User>('users')
        .select('id, name')
        .in('id', allUserIds);

      if (!active) return;
      if (uErr) {
        setError(uErr.message);
        setLoading(false);
        return;
      }

      const poiIds = Array.from(
        new Set(checkins.map(ci => ci.thingy_id).filter(Boolean) as string[])
      );

      const { data: pois, error: pErr } = await supabase
        .from<POI>('poi')
        .select('id, title')
        .in('id', poiIds);

      if (!active) return;
      if (pErr) {
        setError(pErr.message);
        setLoading(false);
        return;
      }

      const nameById = new Map(users?.map(u => [u.id, u.name]));
      const poiById  = new Map(pois?.map(p => [p.id, p.title]));

      const formatted = checkins.map(ci => ({
        id:         ci.id,
        caption:    ci.caption,
        image_url:  ci.image_url,
        created_at: ci.created_at,
        poster:     nameById.get(ci.poster_id) || 'Unknown',
        tagged:     ci.tagged_ids.map(id => nameById.get(id) || 'Unknown'),
        poiTitle:   ci.thingy_id ? poiById.get(ci.thingy_id) : null,
      }));

      setItems(formatted);
      setLoading(false);
    }

    load();
    return () => { active = false; };
  }, [mode]);

  return { items, loading, error };
}

export default function CheckinsScreen() {
  const [tab, setTab] = useState<'my' | 'tagged'>('my');
  const { items, loading, error } = useCheckins(tab);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Check-ins' }} />

      <View style={styles.subHeader}>
        {(['my','tagged'] as const).map(t => (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={[
              styles.tabButton,
              tab === t && styles.tabActive
            ]}
          >
            <Text style={styles.tabText}>
              {t === 'my' ? 'My Check-ins' : 'Tagged Check-ins'}
            </Text>
          </Pressable>
        ))}
      </View>

      {loading && <ActivityIndicator size="small" color="#888" style={{ marginTop: 20 }}/>}
      {error && <Text style={styles.error}>{error}</Text>}
      {!loading && !error && items.length === 0 && (
        <Text style={styles.empty}>No check-ins here.</Text>
      )}

      {!loading && !error && items.map(ci => (
        <Pressable
          key={ci.id}
          style={styles.card}
          onPress={() => router.push(`/passport/checkins/${ci.id}`)}
        >
          <Text style={styles.caption}>{ci.caption}</Text>
          <Text style={styles.meta}>
            {tab === 'tagged' && `By ${ci.poster} `}
            {ci.tagged.length > 0 && `With ${ci.tagged.join(', ')} `}
            <Text style={styles.place}>{ci.poiTitle && `@ ${ci.poiTitle}`}</Text>
          </Text>
          {ci.image_url && (
            <Image
              source={{ uri: ci.image_url }}
              style={styles.image}
            />
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff', 
    paddingBottom: 60 
  },
  subHeader: { 
    flexDirection: 'row', 
    marginBottom: 16 
  },
  tabButton: {
    flex: 1, 
    alignItems: 'center', 
    padding: 10, 
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabActive: { 
    backgroundColor: '#ffd6a7' 
  },
  tabText: { 
    fontSize: 16 
  },
  error: { 
    color: 'red', 
    textAlign: 'center', 
    marginVertical: 20 
  },
  empty: { 
    color: '#888', 
    textAlign: 'center', 
    marginVertical: 20 
  },
  card: {
    marginBottom: 16, 
    padding: 16, 
    borderRadius: 16,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, 
    shadowRadius: 2,
  },
  caption: { 
    fontSize: 16, 
    marginBottom: 8 
  },
  meta: { 
    fontSize: 16, 
    color: '#555',
    marginBottom: 8,
  },
  image: { 
    width: '100%', 
    height: 200, 
    borderRadius: 8, 
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 8,
  },
  place: {
    fontStyle: 'italic', 
    color: '#777',
    fontSize: 14,
  }
});