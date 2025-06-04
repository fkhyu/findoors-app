import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

/*

1. get friend code
2. get friend id by code from friend_code
3. create new entry in friends table with user_id and friend_id

*/

const AddFriendsScreen = () => {
  const [friendId, setFriendId] = useState('');

  const fetchFriendId = async (code) => {
    try {
      const { data, error } = await supabase
        .from('friend_code')
        .select('*')
        .eq('code', code)
        .single();
      if (error) {
        console.error('Error fetching friend ID:', error.message);
        Alert.alert('Error', 'Failed to fetch friend ID. Please try again.');
      } else if (data) {
        return data.friend_id;
      } else {
        Alert.alert('Not Found', 'No friend found with this code.');
        return null;
      }
    } catch (error) {
      console.error('Unexpected error fetching friend ID:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      return null;
    }
  };

  const handleAddFriend = () => {
    if (friendId.length === 6) {
      fetchFriendId(friendId).then((fetchedFriendId) => {
        if (fetchedFriendId) {
          supabase
            .from('friends')
            .insert([{ user_id: supabase.auth.getUser()?.id, friend_id: fetchedFriendId }])
            .then(({ error }) => {
              if (error) {
                console.error('Error adding friend:', error.message);
                Alert.alert('Error', 'Failed to add friend. Please try again.');
              } else {
                Alert.alert('Success', 'Friend added successfully!');
              }
            });
        }
      });
      setFriendId(''); // Clear input after submission
    } else {
      Alert.alert('Invalid ID', 'Friend ID must be 6 characters long.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Friend</Text>
      <Text style={styles.label}>Enter Friend ID (6 characters):</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., ABC123"
        value={friendId}
        onChangeText={setFriendId}
        maxLength={6}
        autoCapitalize="characters"
      />
      <Button title="Add Friend" onPress={handleAddFriend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
});

export default AddFriendsScreen;