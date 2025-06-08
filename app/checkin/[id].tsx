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

  const s3api =
    'https://341668e4ddc3fc8087067598f9a78e63.r2.cloudflarestorage.com/otamapsf-images';

  const uploadImageToR2 = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileName = `checkin-${id}-${Date.now()}.jpg`;
    const uploadUrl = `${s3api}/${fileName}`;
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'image/jpeg' },
      body: blob,
    });
    if (!uploadResponse.ok) { 
      console.error('Failed to upload image:', uploadResponse);
      throw new Error('Failed to upload image to R2');
    }
    return uploadUrl;
  };

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
    try {
      setUploading(true);
      if (!imageUri) return;
      const uploadedUrl = await uploadImageToR2(imageUri);
      console.log('✅ Uploaded!', uploadedUrl);
      // TODO: send uploadedUrl, caption, selectedFriends, and location ID to backend
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
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
