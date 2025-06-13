import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const CheckinScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [caption, setCaption] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<{ id: string; username: string }[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [allFriends, setAllFriends] = useState<{ id: string; username: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Load friend list on mount
  useEffect(() => {
    (async () => {
      // get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      // fetch friend relations
      const { data: friendLinks, error: linkError } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user.id);
      if (linkError || !friendLinks) return;
      const friendIds = friendLinks.map((link) => link.friend_id);
      // fetch user info for those friends
      const { data: friendUsers, error: userError } = await supabase
        .from('users')
        .select('id, username')
        .in('id', friendIds);
      if (userError || !friendUsers) return;
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
    f.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFriendTag = (friend: { id: string; username: string }) => {
    if (!selectedFriends.find((f) => f.id === friend.id)) {
      setSelectedFriends((prev) => [...prev, friend]);
    }
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Check-In</Text>
      <Text style={styles.subtext}>Stamp a memory for location: {id}</Text>

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
        onChangeText={setCaption}
        style={styles.input}
      />

      <View style={styles.friendInputContainer}>
        <TextInput
          placeholder="Tag friends by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
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
                <Text>{item.username}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        <View style={styles.tagsContainer}>
          {selectedFriends.map((f) => (
            <View key={f.id} style={styles.tag}>
              <Text style={styles.tagText}>@{f.username}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCheckin} disabled={uploading}>
        <Text style={styles.buttonText}>{uploading ? 'Checking in...' : '✨ Check In'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckinScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF3E0',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#5C4B51',
  },
  subtext: {
    fontSize: 16,
    color: '#7D6E75',
    marginBottom: 20,
  },
  imagePicker: {
    width: 220,
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
    backgroundColor: '#FFF',
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
    backgroundColor: '#FFE066',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 18,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#5C4B51',
    fontWeight: '600',
  },
});
