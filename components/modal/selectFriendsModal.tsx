import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SelectFriendsModalProps {
  visible: boolean;
  initialSelected: string[];
  onClose: () => void;
  onSubmit: (selectedIds: string[]) => void;
}

interface User {
  id: string;
  username: string;
  avatar_url?: string;
}

const SelectFriendsModal: React.FC<SelectFriendsModalProps> = ({
  visible,
  initialSelected,
  onClose,
  onSubmit,
}) => {
  const [friends, setFriends] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelected);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (!visible) return;
    setSearch('');
    setSelectedIds(initialSelected);

    (async () => {
      // Fetch current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) return;

      // Fetch friend IDs
      const { data: friendRecords, error: friendsError } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', user.id);
      if (friendsError || !friendRecords) return;

      console.log('Friend records:', friendRecords);

      const friendIds = friendRecords.map((r) => r.friend_id);
      if (friendIds.length === 0) {
        setFriends([]);
        return;
      }

      // Fetch user profiles
      const { data: userProfiles, error: profilesError } = await supabase
        .from('users')
        .select('*')
        .in('id', friendIds);
      if (profilesError || !userProfiles) return;

      setFriends(userProfiles);
      console.log('Fetched friends:', userProfiles);
    })();
  }, [visible]);

  const filtered = friends.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const renderItem = ({ item }: { item: User }) => (
    <Pressable style={styles.item} onPress={() => toggleSelect(item.id)}>
      <Text style={styles.username}>{item.name}</Text>
      {selectedIds.includes(item.id) && <Text>✓</Text>}
    </Pressable>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Text style={styles.header}>Select Friends</Text>
          <Pressable onPress={() => onSubmit(selectedIds)}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search friends..."
          value={search}
          onChangeText={setSearch}
        />
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default SelectFriendsModal;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', paddingTop: 60, },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelText: { color: '#FF3B30', fontSize: 16 },
  doneText: { color: '#007AFF', fontSize: 16, fontWeight: '500' },
  header: { fontSize: 18, fontWeight: '600' },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginVertical: 12,
  },
  item: {
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: { fontSize: 16 },
  separator: { height: 1, backgroundColor: '#eee' },
});
