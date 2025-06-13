import { supabase } from '@/lib/supabase';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const AddFriendScreen = () => {
  const { id } = useLocalSearchParams();
  const [ fcData, setFcData ] = useState<any>(null);
  const [ friendInfo, setFriendInfo ] = useState<any>(null);

  const getFriendInformation = async (friendId: string) => {
    try {
      const { data: codeData, error: codeError } = await supabase
        .from('friend_code')
        .select('*')
        .eq('code', friendId)
        .single();
      if (codeError) {
        console.error('Error fetching friend code:', codeError.message);
        return;
      }
      if (!codeData) {
        console.error('No friend code found for this ID');
        return;
      }
      setFcData(codeData);
      console.log('Fetched Friend Code Data:', codeData);

      const userId = codeData.user_id;
      console.log('Fetching friend information for user ID:', userId);

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
      if (userError) {
        console.error('Error fetching friend information:', userError.message);
        return;
      }
      if (!userData) {
        console.log(userData)
        console.error('No user found for this ID ' + userId);
        return;
      }
      console.log(userData)
      setFriendInfo(userData);
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  useEffect(() => {
    if (id) {
      getFriendInformation(id as string);
    }
  }, [id]);

  if (!id) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No Valid Friend Code Provided</Text>
      </View>
    );
  }

  if (!fcData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading Friend Information...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Add Friend',
          headerTitleStyle: { fontSize: 20 },
          headerStyle: { backgroundColor: '#f8f8f8' },
          headerTintColor: '#333',
        }}
      />
      <Text style={styles.friendCode}>Friend Code: {id}</Text>
      <Text style={styles.title}>{friendInfo.name}</Text>
      <Text>{friendInfo.age} {friendInfo.country}</Text>
    </View>
  );
};

export default AddFriendScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  friendCode: {
    fontSize: 18,
    color: '#333',
  },
});