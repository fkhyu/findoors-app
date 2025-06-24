import { useAchievements } from '@/lib/AchievementContext';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const CheckinScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [caption, setCaption] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFriends, setSelectedFriends] = useState<{ id: string; name: string }[]>([]);
  const [allFriends, setAllFriends] = useState<{ id: string; name: string }[]>([]);  const [searchQuery, setSearchQuery] = useState('');
  const { unlockAchievement, achievements } = useAchievements();
  const [poiName, setPoiName] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    const fetchPOIName = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from('poi')
        .select('title')
        .eq('id', id)
        .single();
      if (error) {
        console.error('[CheckinScreen] Error fetching POI name:', error);
      } else {
        setPoiName(data?.title || null);
      }
    };
    fetchPOIName();
  }, [id]);

  // Load friend list on mount
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: friendLinks, error: linkError } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', user.id);
      if (linkError || !friendLinks) return;
      const friendIds = friendLinks.map((link) => link.friend_id);

      const { data: friendUsers, error: userError } = await supabase
        .from('users')
        .select('*')
        .in('id', friendIds); 
      if (userError || !friendUsers) return;
      console.debug('[CheckinScreen] Loaded friends:', friendUsers);
      setAllFriends(friendUsers);
    })();
  }, []);

  async function getPresignedUrl(filename: string, contentType: string) {
    console.debug('[getPresignedUrl] filename:', filename, 'contentType:', contentType);
    const start = Date.now();

    const res = await supabase.functions.invoke("r2-upload", {
      body: JSON.stringify({ filename, contentType }),
    });

    console.debug(`[getPresignedUrl] invoke() took ${Date.now() - start}ms`, res);
    if (res.error) {
      console.error('[getPresignedUrl] supabase.functions.invoke error:', res.error);
      throw res.error;
    }

    const url = (res.data as { url: string }).url;
    console.debug('[getPresignedUrl] received URL:', url);
    return url;
  }

  async function uploadImageToR2(uri: string) {
    console.debug('[uploadImageToR2] start uri:', uri);
    let response: Response;
    try {
      response = await fetch(uri); 
    } catch (e) {
      console.error('[uploadImageToR2] fetch(uri) failed:', e);
      throw new Error(`Could not fetch local image: ${e.message}`);
    }

    console.debug('[uploadImageToR2] local fetch status:', response.status);
    const blob = await response.blob();
    console.debug('[uploadImageToR2] blob size:', blob.size, 'type:', blob.type);

    const fileName = `checkin-${id}-${Date.now()}.png`;

    let presignedUrl: string;
    try {
      presignedUrl = await getPresignedUrl(fileName, blob.type);
    } catch (e) {
      console.error('[uploadImageToR2] getPresignedUrl error:', e);
      throw e;
    }

    console.debug('[uploadImageToR2] uploading to:', presignedUrl);
    let uploadRes: Response;
    try {
      uploadRes = await fetch(presignedUrl, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": blob.type },
      });
    } catch (e) {
      console.error('[uploadImageToR2] fetch(presignedUrl) failed:', e);
      throw new Error(`Network error during upload: ${e.message}`);
    }

    console.debug('[uploadImageToR2] upload status:', uploadRes.status, uploadRes.statusText);
    if (!uploadRes.ok) {
      const text = await uploadRes.text().catch(() => '<could not read body>');
      console.error('[uploadImageToR2] upload failed body:', text);
      throw new Error(`R2 upload failed with ${uploadRes.status}`);
    }

    unlockAchievement('memory_maker');
    const publicUrl = `https://media.brickks.dev/${fileName}`;
    console.debug('[uploadImageToR2] success, public URL:', publicUrl);
    return publicUrl;
  }

  const requestCameraPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permissions are required!');
      }
    }
  };

  useEffect(() => {
    requestCameraPermissions();
  }, []);

  const handlePickImage = async () => {
    const { canceled, assets } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!canceled && assets.length > 0) {
      setImageUri(assets[0].uri);
    } else {
      const cameraResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (!cameraResult.canceled) {
        setImageUri(cameraResult.assets[0].uri);
      }
    }
  };

  const handleCheckin = async () => {
    console.debug('[handleCheckin] start');
    try {
      setUploading(true);
      if (!imageUri) {
        console.warn('[handleCheckin] no imageUri');
        return;
      }
      const uploadedUrl = await uploadImageToR2(imageUri);
      console.debug('[handleCheckin] Uploaded URL:', uploadedUrl);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('[handleCheckin] auth.getUser error:', userError);
        throw userError || new Error('No user');
      }

      const { data, error } = await supabase
        .from('check_ins')
        .insert({
          poster_id: user.id,
          thingy_id: id,
          caption,
          image_url: uploadedUrl,
          tagged_ids: selectedFriends.map((f) => f.id),
          public: isPublic,
        })
        .select('*')
        .single();

      if (error) {
        console.error('[handleCheckin] insert error:', error);
        throw error;
      }
      console.debug('[handleCheckin] database insert success:', data);
    } catch (err: any) {
      console.error('[handleCheckin] caught error:', err.message, err);
      alert(`Error: ${err.message}`);
    } finally {
      setUploading(false);
      console.debug('[handleCheckin] end');
    }
  };

  // Filter friends by search query
  const filteredFriends = allFriends.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFriendTag = (friend: { id: string; name: string }) => {
    if (!selectedFriends.find((f) => f.id === friend.id)) {
      setSelectedFriends((prev) => [...prev, friend]);
    }
    setSearchQuery('');
  };

  return (
    <KeyboardAvoidingView style={styles.rootContainer} behavior="padding" enabled keyboardVerticalOffset={100}>      
      <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Check In',
          headerTitleStyle: { fontSize: 20, color: '#5C4B51' },
          headerStyle: { backgroundColor: '#FAF3E0' },
          headerTintColor: '#5C4B51',
        }}
      />
      <View style={{ width: '100%', gap: 0 }}>
        <Text style={styles.subtext_nomargin}>Stamp a memory for location:{"\n"}</Text>
        <Text style={styles.subtext}>{poiName}</Text>
      </View>
      
      <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <Text style={styles.pickText}>Tap to take a photo</Text>
        )}
      </TouchableOpacity>

      <TextInput
        placeholder="Write a cute caption..."
        value={caption}
        placeholderTextColor={'#999'}
        onChangeText={setCaption}
        style={styles.input}
      />

      <View style={styles.friendInputContainer}>
        <TextInput
          placeholder="Tag friends by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={'#999'}
          style={[styles.input, { marginBottom: 5 }]}
        />
        {searchQuery.length > 0 && (
          <FlatList
            data={filteredFriends}
            keyExtractor={(item) => item.id}
            style={styles.suggestions}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => addFriendTag(item)}
                style={styles.suggestionItem}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        <View style={styles.tagsContainer}>
          {selectedFriends.map((f) => (
            <View key={f.id} style={styles.tag}>
              <Text style={styles.tagText}>{f.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
        <TouchableOpacity
          onPress={() => setIsPublic((prev) => !prev)}
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: '#DABFAA',
            backgroundColor: isPublic ? '#fe9a00' : '#FFF',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}
        >
          {isPublic && (
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 12,
                backgroundColor: '#fff',
              }}
            />
          )}
        </TouchableOpacity>
        <Text style={{ fontSize: 16, color: '#5C4B51' }}>Make this check-in public</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCheckin} disabled={uploading}>
        <Text style={styles.buttonText}>{uploading ? 'Checking in...' : 'Check In'}</Text>
      </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CheckinScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FAF3E0',
    padding: 20,
    paddingBottom: 0,
    alignContent: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#5C4B51',
  },
  subtext: {
    fontSize: 18,
    color: '#404040',
    fontWeight: '500',
    marginBottom: 20,
  },
  subtext_nomargin: {
    fontSize: 16,
    color: '#7D6E75'
  },
  imagePicker: {
    width: '100%',
    height: 220,
    backgroundColor: '#FFF5E5',
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#DABFAA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickText: {
    fontSize: 16,
    color: '#9A8575',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    marginBottom: 15,
    borderColor: '#ECD9C6',
    borderWidth: 1,
  },
  friendInputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  suggestions: {
    maxHeight: 120,
    backgroundColor: '#fff7ed',
    borderColor: '#ECD9C6',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 5,
  },
  suggestionItem: {
    padding: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#DABFAA',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    color: '#5C4B51',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#fe9a00',
    paddingVertical: 12,
    // paddingHorizontal: 60,
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 10,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#461901',
    fontWeight: '600',
  },
});
