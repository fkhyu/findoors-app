import { supabase } from '@/lib/supabase';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Dimensions, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export type POIModalMethods = {
  snapToMax: () => void;
  snapToMid: () => void;
  close: () => void;
  present: () => void;
}

interface POI {
  id: string; // Corrected from Text to string
  lat: number;
  lon: number; 
  title: string;
  icon_url: string;
  address: string; // Assuming address is a string, adjust if necessary
  type: string; // sight, food, view, event, gem
  description?: string;
}

export interface POIModalProps {
  initialSnap?: 'max' | 'mid' | 'min';
  maxHeight?: number;
  midHeight?: number;
  minHeight?: number;
  selectedPoiData?: POI;
  messages?: [];
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const openMapWithDirections = (lat: number, lon: number) => {
  let url = '';

  if (Platform.OS === 'ios') {
    // Apple Maps
    url = `http://maps.apple.com/?daddr=${lat},${lon}&dirflg=d`;
  } else {
    // Google Maps
    url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  }

  Linking.openURL(url).catch(err => console.error('Error launching map:', err));
};

const POIModal = forwardRef<POIModalMethods, POIModalProps>(
  (
    {
      initialSnap = 'mid',
      maxHeight = SCREEN_HEIGHT * 0.95,
      midHeight = SCREEN_HEIGHT * 0.5,
      minHeight = SCREEN_HEIGHT * 0.3,
      selectedPoiData = {
        id: '',
        lat: 0,
        lon: 0,
        title: '',
        icon_url: '',
      } as POI, 
      messages = [],
    },
    ref
  ) => {
    const sheetRef = useRef<BottomSheetModal>(null);

    const snapPoints = useMemo(
      () => [
        `${Math.round(minHeight / SCREEN_HEIGHT * 100)}%`,
        `${Math.round(midHeight / SCREEN_HEIGHT * 100)}%`,
        `${Math.round(maxHeight / SCREEN_HEIGHT * 100)}%`,
      ],
      [maxHeight, midHeight, minHeight]
    );

    const initialIndex = useMemo(() => {
      switch (initialSnap) {
        case 'max':
          return 2;
        case 'mid':
          return 1;
        default:
          return 0;
      }
    }, [initialSnap])

    const handlePresent = useCallback(() => {
      sheetRef.current?.present();
      sheetRef.current?.snapToIndex(initialIndex);
    }, [initialIndex]);

    useImperativeHandle(ref, () => ({
      present: handlePresent,
      snapToMid: () => sheetRef.current?.snapToIndex(1),
      snapToMax: () => sheetRef.current?.snapToIndex(2),
      close: () => sheetRef.current?.close(),
    }));


    // Map of user_id to user name
    const [userMap, setUserMap] = useState<Record<string, string>>({});
    const [comment, setComment] = useState<string>('');
    const [wantToVisit, setWantToVisit] = useState<boolean>(false);

    useEffect(() => {
      if (messages.length > 0) {
        const fetchUsers = async () => {
          // Extract unique, non-null user IDs
          const userIds = Array.from(new Set(
            messages
              .map((m: any) => m.user_id)
              .filter((id: string | null): id is string => id !== null && id !== undefined)
          ));
          if (userIds.length === 0) {
            return;
          }
          const { data, error } = await supabase
            .from('users')
            .select('id, name')
            .in('id', userIds);
          if (error) {
            console.error('Error fetching user data:', error);
          } else if (data) {
            const map: Record<string, string> = {};
            data.forEach((u: any) => { map[u.id] = u.name; });
            setUserMap(map);
          }
          
          // Get want to visit status and set state
          const status = await getWantToVisitStatus(selectedPoiData.id);
          setWantToVisit(status);
        };
        fetchUsers();
      }
    }, [messages]);

    const sendComment = async (content: string) => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        console.error('Error fetching user for comment:', userError);
        return;
      }

      supabase
        .from('messages')
        .insert({
          thingy_id: selectedPoiData.id,
          user_id: userData.user.id,
          content: content,
        })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error sending comment:', error);
          } else {
            console.log('Comment sent successfully:', data);
            setComment(''); // Clear the input after sending
          }
        });
    };

    async function getWantToVisitStatus(poiId: string): Promise<boolean> {
      try {
        const {
          data: { user },
          error: authError
        } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error('Error fetching auth user:', authError);
          return false;
        }

        const { data: profile, error: profileError } = await supabase
          .from('want_to_visit')
          .select('*')
          .eq('uid', user.id)
        if (profileError) {
          console.error('Error fetching want_to_visit:', profileError);
          return false;
        }

        console.log('Fetched profile:', profile);

        return Array.isArray(profile.want_to_visit)
          ? profile.want_to_visit.includes(poiId)
          : false;

      } catch (unexpected) {
        console.error('Unexpected error in getWantToVisitStatus:', unexpected);
        return false;
      }
    }

  const handleAddToVisit = async () => {
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return;
    }

    // 2) fetch their current array
    const { data: profile, error: fetchError } = await supabase
      .from('want_to_visit')
      .select('*')
      .eq('uid', user.id)
      .single();
    if (fetchError) {
      console.error('Fetch want_to_visit error:', fetchError);
      return;
    }

    const existing = Array.isArray(profile.thingy_id)
      ? profile.thingy_id
      : [];
    if (existing.includes(selectedPoiData.id)) {
      return setWantToVisit(true);
    }
    const updated = [...existing, selectedPoiData.id];

    // 4) write it back
    const { error: updateError } = await supabase
      .from('want_to_visit')
      .update({ thingy_id: updated })
      .eq('uid', user.id);
    if (updateError) {
      console.error('Update want_to_visit error:', updateError);
    } else {
      setWantToVisit(true);
    }
  };

  // Removes the POI from want_to_visit
  const handleRemoveFromVisit = async () => {
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return;
    }

    const { data: profile, error: fetchError } = await supabase
      .from('want_to_visit')
      .select('*')
      .eq('uid', user.id)
      .single();
    if (fetchError) {
      console.error('Fetch want_to_visit error:', fetchError);
      return;
    }

    const existing = Array.isArray(profile.thingy_id)
      ? profile.thingy_id
      : [];
    const updated = existing.filter((id) => id !== selectedPoiData.id);

    const { error: updateError } = await supabase
      .from('want_to_visit')
      .update({ thingy_id: updated })
      .eq('uid', user.id);
    if (updateError) {
      console.error('Update want_to_visit error:', updateError);
    } else {
      setWantToVisit(false);
    }
  };

    if (!selectedPoiData || !selectedPoiData.id) {
      return null; 
    }

    return (
      <BottomSheetModal
        ref={sheetRef}
        index={initialIndex}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetView style={styles.content}>
          <Text style={styles.title}>{selectedPoiData.title}</Text>
          <Text style={styles.type}>
            {selectedPoiData.type === 'event' ? '🎟️ Event' :
            selectedPoiData.type === 'food' ? '🍽️ Food Spot' :
            selectedPoiData.type === 'view' ? '🌆 Scenic View' :
            selectedPoiData.type === 'hidden' ? '🕵️ Hidden Gem' : 
            selectedPoiData.type === 'share' ? '📢 Shared Location' :
            selectedPoiData.type === 'uevent' ? '🎉 User Event' :
            '📍 Landmark'}
          </Text>

          {selectedPoiData.address ? (
            <Text style={styles.address}>{selectedPoiData.address}</Text> 
          ) : null}


          {wantToVisit ? (
            <Pressable style={styles.visitedContainer} onPress={handleRemoveFromVisit}>
              <MaterialIcons name="bookmark" size={24} color="#fff" />
              <Text style={styles.visitedText}>Want to visit</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.wantToVisitContainer} onPress={handleAddToVisit}> 
              <MaterialIcons name="bookmark-border" size={24} color="#F4A261" />
              <Text style={styles.wantToVisitText}>Want to visit</Text>
            </Pressable>
          )} 
          
          <View style={styles.CTAContainer}>
            <Pressable
              onPress={() => openMapWithDirections(selectedPoiData.lat, selectedPoiData.lon)}
              style={styles.directionsButton}
            >
              <MaterialIcons name="directions" size={24} color="#fff" />
              <Text style={styles.directionsText}>Get Directions</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                sheetRef.current?.close(); 
                router.push(`/checkin/${selectedPoiData.id}`)
              }}
              style={styles.directionsButton}
            >
              <MaterialCommunityIcons name="location-enter" size={24} color="#fff" />
              <Text style={styles.directionsText}>Check-In</Text>
            </Pressable> 
          </View>

          {selectedPoiData.description ? (
            <Text style={styles.description}>{selectedPoiData.description}</Text>
          ) : null}

          <BottomSheetScrollView style={styles.chatContainer}>
            <Text style={styles.photos}>Photos and Comments</Text>

            {messages.length > 0 ? (
              messages.map((message: any) => (
                <View key={message.id} style={{ marginBottom: 10 }}>
                  <Text style={{ fontWeight: 'bold' }}>{userMap[message.user_id] || message.user_id}</Text>
                  <Text>{message.content}</Text>
                </View>
              ))
            ) : (
              <Text style={{ paddingVertical: 72, textAlign: 'center', color: '#a1a1a1' }}>No comments yet. Be the first to share!</Text>
            )}
            
            <TextInput
              placeholder="Write a comment..."
              style={{ 
                height: 40, 
                borderColor: '#ccc', 
                borderWidth: 1, 
                borderRadius: 8, 
                paddingHorizontal: 10,
                marginBottom: 10,
              }}
              value={comment}
              onChangeText={(text) => {
                setComment(text);
              }}
              onSubmitEditing={(e) => {
                sendComment(e.nativeEvent.text);
              }}
              placeholderTextColor={'#a1a1a1'}
            />
            <Pressable
              onPress={() => {
                sendComment(comment);
                setComment('');
              }}
              style={{ 
                backgroundColor: comment.trim() ? '#F4A261' : '#ccc', 
                padding: 10, 
                borderRadius: 8, 
                alignItems: 'center',
              }}
              disabled={!comment.trim()}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send Comment</Text>
            </Pressable>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
)

POIModal.displayName = 'POIModal';

export default POIModal;

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  handle: { 
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ccc',
    marginBottom: 8,
  }, 
  content: {
    padding: 16, 
    paddingTop: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8, 
  },
  address: {
    fontSize: 14,
  },
  type: {
    fontSize: 14,
    color: '#6B7B78',
    marginBottom: 12,
    fontStyle: 'italic',
  }, 
  description: {
    fontSize: 15,
    color: '#444',
    marginTop: 8,
    marginBottom: 10,
  },
  hours: {
    fontSize: 14,
    color: '#888',
    marginBottom: 6,
  },
  visited: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  unvisited: {
    color: '#FF9800',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  photos: {
    fontSize: 18,
    color: '#262626',
    marginVertical: 8,
    textAlign: 'center',
    fontWeight: '500'
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4A261',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 8,
    flex: 1,
  },
  directionsText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  CTAContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  chatContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  visitedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4A261',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 8,
    flex: 1,
  },
  wantToVisitText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#F4A261',
    fontWeight: 'bold',
  },
  visitedText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  wantToVisitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 8,
    flex: 1,
    borderWidth: 2,
    borderColor: '#F4A261',
  },
})