import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

const AddFriendsScreen = () => {
  const [friendId, setFriendId] = useState('');
  const [myFriendCode, setMyFriendCode] = useState('Loading...');

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
        console.log('Fetched Friend ID:', data.user_id);
        return data.user_id; 
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

  const fetchMyFriendCode = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('friend_code')
          .select('code')
          .eq('user_id', user.id)
          .single();
        if (error) {
          console.error('Error fetching my friend code:', error.message);
          Alert.alert('Error', 'Failed to fetch your friend code. Please try again.');
        } else if (data) {
          setMyFriendCode(data.code);
        } else {
          Alert.alert('Not Found', 'Your friend code was not found.');
        }
      } else {
        Alert.alert('Error', 'You are not logged in. Please log in to continue.');
      }
    } catch (error) {
      console.error('Unexpected error fetching my friend code:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  useEffect(() => {
    fetchMyFriendCode();
  }, []);

  const handleAddFriend = () => {
    if (friendId.length === 6) {
      console.log('Adding friend with ID:', friendId);
      fetchFriendId(friendId).then(async (fetchedFriendId) => {
        if (fetchedFriendId) {
          console.log('Fetched Friend ID:', fetchedFriendId);
          const { data: { user } } = await supabase.auth.getUser()
          supabase
            .from('friends')
            .insert([{ user_id: user.id, friend_id: fetchedFriendId }])
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
      <Text style={{ color: '#333' }}>Your friend code:</Text>
      <Text style={{ color: '#333', fontWeight: 'bold', fontSize: 18 }}>{myFriendCode}</Text>
      <Button
        title="Show QR Code"
        onPress={() => router.push(`/friends/qr/${myFriendCode}`)}
      />

      <Text style={styles.label}>Enter Friend Code</Text>
      <View style={styles.codeInputContainer}>
        <TextInput
          style={[styles.codeInput, { letterSpacing: 12, textAlign: 'center' }]}
          value={friendId}
          onChangeText={setFriendId}
          maxLength={6}
          autoCapitalize="characters"
          placeholder="XXXXXX"
          placeholderTextColor="#AAAAAA"
          autoCorrect={false}
        />
      </View>
      
      <Button
        title="Add Friend" 
        onPress={handleAddFriend} 
        disabled={friendId.length !== 6}
        color="#4285F4"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    marginBottom: '60%'
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
    color: '#333',
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
  codeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  codeInput: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 24,
    backgroundColor: '#fff',
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    letterSpacing: 12,
    textAlign: 'center',
  },

});

export default AddFriendsScreen;